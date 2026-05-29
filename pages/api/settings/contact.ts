import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = extractTokenFromHeader(req.headers.authorization);
  const isAuthorized = token && verifyToken(token);

  if (req.method !== 'GET' && !isAuthorized) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      let settings = await prisma.contactSettings.findFirst();

      if (!settings) {
        settings = await prisma.contactSettings.create({
          data: { email: process.env.CONTACT_EMAIL || 'info@sblueenergy.com' },
        });
      }

      return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const existingSettings = await prisma.contactSettings.findFirst();

      if (!existingSettings) {
        const settings = await prisma.contactSettings.create({
          data: { email },
        });
        return res.status(200).json(settings);
      }

      const updated = await prisma.contactSettings.update({
        where: { id: existingSettings.id },
        data: { email },
      });

      return res.status(200).json(updated);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
