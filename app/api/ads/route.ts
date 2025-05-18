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

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (user?.course && user?.university && user?.yearOfStudy) {
        const ads = await prisma.ads.findMany({
          where: {
            OR: [
              { targetedCourses: { has: user.course } },
              { targetedUniversities: { has: user.university } },
              { targetedYearOfStudies: { has: user.yearOfStudy } },
            ],
          },
        });
        res.status(200).json(ads);
      } else {
        const ads = await prisma.ads.findMany();
        res.status(200).json(ads);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { title, description, imageUrl, university, course, targetedCourses, targetedUniversities, targetedYearOfStudies } = req.body;
      res.status(200).json(ads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { title, description, imageUrl, university, course } = req.body;
    
    try{
      const newAd = await prisma.ads.create({
        data: {
          title,
          description,
          imageUrl,
          university,
          course,
          targetedCourses: targetedCourses || [],
          targetedUniversities: targetedUniversities || [],
          targetedYearOfStudies: targetedYearOfStudies || [],
          authorId: session.user.id,
        },
      });
      res.status(201).json(newAd);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}