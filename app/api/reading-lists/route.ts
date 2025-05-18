import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const readingLists = await prisma.readingList.findMany({
        include: {
          user: true,
        },
      });
      return res.status(200).json(readingLists);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Bad request' });
    }
    try {
      const readingList = await prisma.readingList.create({
        data: {
          name,
          description,
          userId: session.user.id,
        },
      });
      return res.status(201).json(readingList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}