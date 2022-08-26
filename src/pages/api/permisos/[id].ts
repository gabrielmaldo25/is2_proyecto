import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    body,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      try {
        const text = "SELECT * FROM permisos WHERE id_user = $1";
        const values = [id];
        const result = await conn.query(text, values);

        if (result.rowCount === 0)
          return res.status(404).json({ message: "Permiso no encontrado" });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "PUT":
      try {
        const { descripcion, id_form } = body;
        const text =
          "UPDATE permisos SET descripcion = $1, id_from = $2 WHERE id_permiso = $3 RETURNING *";
        const values = [descripcion, id_form, id];
        const result = await conn.query(text, values);
        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "DELETE":
      try {
        const text = "DELETE FROM permisos WHERE id_permiso = $1 RETURNING *";
        const values = [id];
        const result = await conn.query(text, values);

        if (result.rowCount === 0)
          return res.status(404).json({ message: "Permiso no encontrado" });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: "Método inválido." });
  }
};