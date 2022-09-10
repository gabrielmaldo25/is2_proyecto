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
        const { name, email, password, rol, id_user, new_rol } = body;
        let query = 'UPDATE usuarios SET name = $1, email = $2';
        if (!isNilorEmpty(password)) query += ", password = $4 ";
        query += "WHERE id_user = $3 RETURNING *";
        let values = [name, email, id_user];
        if (!isNilorEmpty(password)) values.push(password);
        let response = await conn.query(query, values);

        query = 'delete from usuario_rol where id_user = $1 AND id_rol = $2';
        values = [id_user, rol[0].id_rol]
        await conn.query(query, values);

        query = 'INSERT INTO usuario_rol (id_user, id_rol, valido_desde, valido_hasta) VALUES ($1, $2, $3, $4)';
        values = [id_user, new_rol.id? new_rol.id : rol[0].id_rol , 
        rol[0].valido_desde? rol[0].valido_desde : new Date().toLocaleDateString(), 
        new_rol.valido_hasta? new_rol.valido_hasta : rol[0].valido_hasta];
        response = await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "DELETE":
      try {
        let text = "DELETE FROM usuario_rol WHERE id_user = $1 AND id_rol = $2 RETURNING *";
        let values = [id, body[0].id_rol];
        let result = await conn.query(text, values);

        if (result.rowCount === 0)
          return res.status(404).json({ message: "usuario_rol no encontrado" });

        text = "DELETE FROM usuarios WHERE id_user = $1 RETURNING *";
        values = [id];
        result = await conn.query(text, values);
  
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
