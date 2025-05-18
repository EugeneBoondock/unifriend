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
      const helpRequests = await prisma.helpRequest.findMany();
      return res.status(200).json(helpRequests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    const { title, description, category, university, course } = req.body;
    if (!title || !description || !category || !university || !course) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const newHelpRequest = await prisma.helpRequest.create({
        data: {
          title,
          description,
          category,
          university,
          course,
          authorId: session.user.id,
        },
      });
      return res.status(201).json(newHelpRequest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}