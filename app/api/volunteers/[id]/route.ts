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

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const volunteer = await prisma.volunteer.findUnique({
        where: { id: id },
        include: {
          user: true
        }
      });

      if (!volunteer) {
        return res.status(404).json({ message: 'Volunteer not found' });
      }

      return res.status(200).json(volunteer);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'PATCH') {
    const { category, university, course } = req.body;

    if (!category || !university || !course) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    try {
      const volunteer = await prisma.volunteer.update({
        where: { id: id },
        data: {
          category,
          university,
          course,
        },
        include: {
          user: true
        }
      });
      return res.status(200).json(volunteer);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const volunteer = await prisma.volunteer.delete({
        where: { id: id },
      });
      return res.status(200).json({ message: 'Volunteer deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}