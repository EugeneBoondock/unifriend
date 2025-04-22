import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const helpRequestId = Array.isArray(id) ? id[0] : id;

  if (req.method === 'GET') {
    try {
      const helpRequest = await prisma.helpRequest.findUnique({
        where: { id: helpRequestId },
      });
      if (!helpRequest) {
        return res.status(404).json({ message: 'Help request not found' });
      }
      return res.status(200).json(helpRequest);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting help request' });
    }
  } else if (req.method === 'PATCH') {
    const { title, description, category, university, course } = req.body;
    try {
      const updatedHelpRequest = await prisma.helpRequest.update({
        where: { id: helpRequestId },
        data: { title, description, category, university, course },
      });
      return res.status(200).json(updatedHelpRequest);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating help request' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.helpRequest.delete({
        where: { id: helpRequestId },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting help request' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}