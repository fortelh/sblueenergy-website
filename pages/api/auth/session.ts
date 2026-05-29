import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token || !verifyToken(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded?.userId },
      select: { id: true, username: true, email: true },
    });

    res.status(200).json(admin);
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
