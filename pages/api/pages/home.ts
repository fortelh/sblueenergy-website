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
      let homePage = await prisma.homePage.findFirst();

      if (!homePage) {
        homePage = await prisma.homePage.create({
          data: {
            introductionEN: 'Welcome to Sblueenergy',
            introductionDE: 'Willkommen bei Sblueenergy',
            heroImage: '/images/hero-default.jpg',
          },
        });
      }

      return res.status(200).json(homePage);
    }

    if (req.method === 'PUT') {
      if (!isAuthorized) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { introductionEN, introductionDE, heroImage } = req.body;
      const existingPage = await prisma.homePage.findFirst();

      if (!existingPage) {
        const homePage = await prisma.homePage.create({
          data: { introductionEN, introductionDE, heroImage },
        });
        return res.status(200).json(homePage);
      }

      const updated = await prisma.homePage.update({
        where: { id: existingPage.id },
        data: {
          ...(introductionEN && { introductionEN }),
          ...(introductionDE && { introductionDE }),
          ...(heroImage && { heroImage }),
        },
      });

      return res.status(200).json(updated);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
