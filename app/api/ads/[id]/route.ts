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

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ad ID' });
  }

  if (req.method === 'GET') {
    try {
      const ad = await prisma.ads.findUnique({
        where: { id },
        include: { author: true},
      });

      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }

      return res.status(200).json(ad);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    const { title, description, imageUrl, university, course } = req.body;

    try {
      const ad = await prisma.ads.findUnique({
        where: { id },
      });

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

      if(ad.authorId !== session.user.id){
        return res.status(403).json({ message: 'Forbidden: you are not the author of this ad' });
      }

      const updatedAd = await prisma.ads.update({
          where: { id },
          data: { title, description, imageUrl, university, course, targetedCourses, targetedUniversities, targetedYearOfStudies },
      });

      return res.status(200).json(updatedAd);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
        const ad = await prisma.ads.findUnique({
            where: { id },
          });
    
            if (!ad) {
                return res.status(404).json({ message: 'Ad not found' });
            }
    
          if(ad.authorId !== session.user.id){
            return res.status(403).json({ message: 'Forbidden: you are not the author of this ad' });
          }

      await prisma.ads.delete({
        where: { id },
      });

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}