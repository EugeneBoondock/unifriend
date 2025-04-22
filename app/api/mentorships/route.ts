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

  if (req.method === 'GET') {
    try {
      const mentorships = await prisma.mentorship.findMany({
        include: {
            mentor: {
                select: {
                    name: true,
                    image: true,
                }
            }
        }
      });
      return res.status(200).json(mentorships);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { subject, description, mentorId } = req.body;

    if (!subject || !description || !mentorId) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    try {
      const mentorship = await prisma.mentorship.create({
        data: {
          subject,
          description,
          mentorId,
        },
      });
      return res.status(201).json(mentorship);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}