// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  console.log("ENTRA:");
  switch (method) {
    case "GET":
      try {
        const query = `select * from formularios`;
        const response = await conn.query(query);
        console.log("RESS: ", response);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        const { name, email, password } = body;

        const query =
          "INSERT INTO usuarios(name, email, password) VALUES ($1, $2, $3) RETURNING *";
        const values = [name, email, password];

        const response = await conn.query(query, values);
        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: "Method is not supported" });
  }
}
