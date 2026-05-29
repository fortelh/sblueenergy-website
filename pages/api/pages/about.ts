import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = extractTokenFromHeader(req.headers.authorization);
  const isAuthorized = token && verifyToken(token);

  try {
    if (req.method === 'GET') {
      let aboutPage = await prisma.aboutPage.findFirst();

      if (!aboutPage) {
        aboutPage = await prisma.aboutPage.create({
          data: {
            descriptionEN: 'Learn about our company',
            descriptionDE: 'Erfahren Sie mehr über unser Unternehmen',
          },
        });
      }

      return res.status(200).json(aboutPage);
    }

    if (req.method === 'PUT') {
      if (!isAuthorized) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { descriptionEN, descriptionDE, teamInfoEN, teamInfoDE } = req.body;
      const existingPage = await prisma.aboutPage.findFirst();

      if (!existingPage) {
        const aboutPage = await prisma.aboutPage.create({
          data: { descriptionEN, descriptionDE, teamInfoEN, teamInfoDE },
        });
        return res.status(200).json(aboutPage);
      }

      const updated = await prisma.aboutPage.update({
        where: { id: existingPage.id },
        data: {
          ...(descriptionEN && { descriptionEN }),
          ...(descriptionDE && { descriptionDE }),
          ...(teamInfoEN && { teamInfoEN }),
          ...(teamInfoDE && { teamInfoDE }),
        },
      });

      return res.status(200).json(updated);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('About page error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
