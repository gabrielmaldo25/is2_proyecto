// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
//import { conn } from "../../../utils/database";
import { conn } from "src/utils/database";
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  console.log("QUERY", query);
  switch (method) {
    case "GET":
      try {
        const q = "SELECT * FROM tasks WHERE id = $1";
        const values = [query.id];
        const response = await conn.query(q, values);

        if (response.rows.length > 0) {
          return res.status(200).json(response.rows[0]);
        } else {
          return res.status(404).json({ message: "Task not found" });
        }
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }

    case "PUT":
      try {
        const { title, description } = body;
        const q =
          "UPDATE tasks SET title = $1, description = $2 where id = $3 RETURNING *";
        const values = [title, description, query.id];
        const response = await conn.query(q, values);

        if (response.rows.length > 0) {
          return res.status(200).json(response.rows[0]);
        } else {
          return res.status(404).json({ message: "Task not found" });
        }
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }

    case "DELETE":
      try {
        const q = "DELETE FROM tasks WHERE id = $1 RETURNING *";
        const values = [query.id];
        const response = await conn.query(q, values);
        if (response.rowCount > 0) {
          return res.status(200).json(response.rows[0]);
        } else {
          return res.status(404).json({ message: "Task not found" });
        }
        return res.json("DELETING");
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    default:
      return res.status(400).json("INVALID");
  }
}
