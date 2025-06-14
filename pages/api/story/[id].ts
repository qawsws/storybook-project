// ✅ /pages/api/story/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "잘못된 요청입니다." });
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return res.status(404).json({ error: "동화를 찾을 수 없습니다." });
    }

    res.status(200).json(story);
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
}
