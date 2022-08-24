// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  switch (method) {
    case "GET":
      try {
        const query = `select p.*, f.nombre_form from permisos p 
        join formularios f on p.id_form = f.id_form
        order by 1 asc;`;
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        const { descripcion, id_form } = body;

        const query =
          "INSERT INTO permisos(descripcion, id_form) VALUES ($1, $2) RETURNING *";
        const values = [descripcion, id_form ];

        const response = await conn.query(query, values);
        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: "Method is not supported" });
  }
}