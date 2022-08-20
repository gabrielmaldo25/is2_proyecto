// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  console.log("METHOD: ", method);

  switch (method) {
    case "GET":
      console.log("ENTRA GET");
      try {
        const query = "SELECT * FROM usuarios";
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        console.log("ENTRA POST");

        const { name, email, password } = body;

        const query =
          "INSERT INTO usuarios(name, email, password) VALUES ($1, $2, $3) RETURNING *";
        const values = [name, email, password];

        const response = await conn.query(query, values);
        console.log("RESS: ", response);
        return res.json(response.rows[0]);
      } catch (error: any) {
        console.log("ENTRA ERRRORRRR: ", error);

        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      console.log("ENTRA DEF");

      return res.status(400).json({ message: "Method is not supported" });
  }
}
