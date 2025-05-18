import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const readingListId = Array.isArray(id) ? id[0] : id;

  if (req.method === 'GET') {
    try {
      const readingList = await prisma.readingList.findUnique({
        where: { id: readingListId },
        include: {
            user: true,
            books: {
                include: {
                    book: true
                }
            }
        }
      });
      if (!readingList) {
        return res.status(404).json({ message: 'Reading list not found' });
      }
      return res.status(200).json(readingList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    const { name, description } = req.body;
    if (!name && !description) {
        return res.status(400).json({ message: 'Bad request' });
    }
    try {
      const readingList = await prisma.readingList.findUnique({
        where: { id: readingListId },
      });
      if (!readingList) {
        return res.status(404).json({ message: 'Reading list not found' });
      }
      if (readingList.userId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const updatedReadingList = await prisma.readingList.update({
        where: { id: readingListId },
        data: {
            name: name ?? readingList.name,
            description: description ?? readingList.description
        },
        include: {
            user: true,
            books: {
                include: {
                    book: true
                }
            }
        }
      });
      return res.status(200).json(updatedReadingList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const readingList = await prisma.readingList.findUnique({
        where: { id: readingListId },
      });
      if (!readingList) {
        return res.status(404).json({ message: 'Reading list not found' });
      }
      if (readingList.userId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      await prisma.readingList.delete({
        where: { id: readingListId },
      });
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}