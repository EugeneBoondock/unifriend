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

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (req.method === 'GET') {
    try {
      const assignmentTemplate = await prisma.assignmentTemplate.findUnique({
        where: { id },
      });
      if (!assignmentTemplate) {
        return res.status(404).json({ message: 'Assignment template not found' });
      }
      return res.status(200).json(assignmentTemplate);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching assignment template', error });
    }
  } else if (req.method === 'PATCH') {
    const { name, description, course, fileUrl } = req.body;
    try {
      const updatedAssignmentTemplate = await prisma.assignmentTemplate.update({
        where: { id },
        data: {
          name,
          description,
          course,
          fileUrl,
        },
      });
      return res.status(200).json(updatedAssignmentTemplate);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating assignment template', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.assignmentTemplate.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting assignment template', error });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}