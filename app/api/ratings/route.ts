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
      const ratings = await prisma.rating.findMany();
      return res.status(200).json(ratings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { value, comment, volunteerId } = req.body;
    if (!value || !volunteerId) {
        return res.status(400).json({ message: "Missing fields" });
    }
    try {
      const newRating = await prisma.rating.create({
        data: {
          value,
          comment,
          volunteerId,
          userId: session.user.id
        },
      });
      return res.status(201).json(newRating);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}