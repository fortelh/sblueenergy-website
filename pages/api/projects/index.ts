import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token || !verifyToken(token)) {
    // Allow GET requests without auth for public access
    if (req.method !== 'GET') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  try {
    if (req.method === 'GET') {
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(projects);
    }

    if (req.method === 'POST') {
      const { titleEN, titleDE, descriptionEN, descriptionDE, image } = req.body;

      if (!titleEN || !titleDE || !descriptionEN || !descriptionDE) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const project = await prisma.project.create({
        data: {
          titleEN,
          titleDE,
          descriptionEN,
          descriptionDE,
          image: image || '',
        },
      });

      return res.status(201).json(project);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
