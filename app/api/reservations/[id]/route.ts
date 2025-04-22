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

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid reservation ID' });
  }

  if (req.method === 'GET') {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          book: true,
          user: true,
        }
      });

      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      return res.status(200).json(reservation);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      await prisma.reservation.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Reservation deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}