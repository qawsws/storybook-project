// /pages/api/delete-story.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing story ID" });

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    await prisma.story.deleteMany({
      where: {
        id,
        userId: user?.id,
      },
    });

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("삭제 실패:", error);
    res.status(500).json({ error: "삭제 실패" });
  }
}
