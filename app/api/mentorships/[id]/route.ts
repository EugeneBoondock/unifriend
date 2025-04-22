import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const mentorship = await prisma.mentorship.findUnique({
        where: { id: id as string },
      });

      if (!mentorship) {
        return res.status(404).json({ message: 'Mentorship not found' });
      }

      return res.status(200).json(mentorship);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'PATCH') {
    const { subject, description, mentorId } = req.body;
    try {
      const mentorship = await prisma.mentorship.update({
        where: { id: id as string },
        data: {
          subject,
          description,
          mentorId,
        },
      });

      return res.status(200).json(mentorship);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const mentorship = await prisma.mentorship.delete({
        where: { id: id as string },
      });

      return res.status(200).json({ message: 'Mentorship deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}