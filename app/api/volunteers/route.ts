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
      const volunteers = await prisma.volunteer.findMany({
        include: {
          user: true,
        }
      });
      return res.status(200).json(volunteers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    const { category, university, course } = req.body;
    const userId = session.user.id;

    if (!category || !university || !course) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const volunteer = await prisma.volunteer.create({
        data: {
          category,
          university,
          course,
          user: {
            connect: { id: userId },
          },
        },
      });
      return res.status(201).json(volunteer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}