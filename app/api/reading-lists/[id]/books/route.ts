import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const { bookId } = req.body;

  if (req.method === 'POST') {
    try {
      const readingListId = Array.isArray(id) ? id[0] : id;

      if (!readingListId) {
        return res.status(400).json({ message: 'Missing reading list ID' });
      }

      if (!bookId) {
        return res.status(400).json({ message: 'Missing book ID' });
      }
        const bookInList = await prisma.bookInReadingList.create({
            data: {
                readingListId,
                bookId
            }
        });
      return res.status(201).json(bookInList);
    } catch (error) {
        console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not allowed.` });
  }
}