import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";
import { isNilorEmpty } from "src/helpers";
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
        const text = "SELECT * FROM usuarios WHERE id_user = $1";
        const values = [id];
        const result = await conn.query(text, values);

        if (result.rowCount === 0)
          return res.status(404).json({ message: "Usuario no encontrado" });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "PUT":
      try {
        const { name, email, password, rol, id_user } = body;
        console.log(JSON.stringify(body) + "body 29")
        let query = 'UPDATE usuarios SET name = $1, email = $2';
        if (!isNilorEmpty(password)) query += ", password = $4 ";
        query += "WHERE id_user = $3 RETURNING *";
        let values = [name, email, id_user];
        if (!isNilorEmpty(password)) values.push(password);
        let response = await conn.query(query, values);

        console.log(response + "response 36")
        query = 'UPDATE usuario_rol SET valido_hasta = $1 WHERE id_user = $2 AND id_rol = $3';
        values = [rol.valido_hasta, response.rows[0].id_user, rol.id_rol, ];
        response = await conn.query(query, values);
        // console.log(JSON.stringify(response) + "response 41")
        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "DELETE":
      try {
        const text = "DELETE FROM usuarios WHERE id_user = $1 RETURNING *";
        const values = [id];
        const result = await conn.query(text, values);

        if (result.rowCount === 0)
          return res.status(404).json({ message: "Usuario no encontrado" });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: "Método inválido." });
  }
};
