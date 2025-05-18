import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const peerReview = await prisma.peerReview.findUnique({
        where: { id: id as string },
      });

      if (!peerReview) {
        return res.status(404).json({ message: 'Peer Review not found' });
      }

      return res.status(200).json(peerReview);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PATCH') {
    const { comment, rating } = req.body;

    try {
      const updatedPeerReview = await prisma.peerReview.update({
        where: { id: id as string },
        data: {
          comment: comment,
          rating: rating,
        },
      });

      return res.status(200).json(updatedPeerReview);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.peerReview.delete({
        where: { id: id as string },
      });

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}