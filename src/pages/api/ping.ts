// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "../../utils/database";
type Data = {
  message: string;
  time: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const response = await conn.query("Select NOW()");
  return res.json({ message: "PONG", time: response.rows[0].now });
};
