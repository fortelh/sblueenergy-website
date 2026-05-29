import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query as { id: string };
  const token = extractTokenFromHeader(req.headers.authorization);
  const isAuthorized = token && verifyToken(token);

  try {
    if (req.method === 'GET') {
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      return res.status(200).json(project);
    }

    if (req.method === 'PUT') {
      if (!isAuthorized) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { titleEN, titleDE, descriptionEN, descriptionDE, image } = req.body;

      const project = await prisma.project.update({
        where: { id },
        data: {
          ...(titleEN && { titleEN }),
          ...(titleDE && { titleDE }),
          ...(descriptionEN && { descriptionEN }),
          ...(descriptionDE && { descriptionDE }),
          ...(image && { image }),
        },
      });

      return res.status(200).json(project);
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await prisma.project.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Project deleted' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
