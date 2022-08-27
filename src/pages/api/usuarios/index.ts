// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  switch (method) {
    case "GET":
      try {
        /* const query = `select u.id_user, u.name, u.email, upr.valido_desde valido_desde,
        upr.valido_hasta valido_hasta, r.nombre descripcion_rol
        from usuarios u left join usuarios_permisos_roles upr on u.id_user = upr.id_user
        left join roles_permisos rp on upr.id_rol_permiso = rp.id_rol_permiso
        left join roles r on r.id_rol = rp.id_rol
        order by 1 asc;`; */
        const query ="select * from usuarios"
        const response = await conn.query(query);
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
