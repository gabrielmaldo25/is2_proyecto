// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  switch (method) {
    case "GET":
      try {
        const query = `select r.*, 
            json_agg(json_build_object('id_permiso',p.id_permiso,'descripcion',p.descripcion)) as permisos
            from roles r
            left join roles_permisos rp
            on r.id_rol = rp.id_rol
            left join permisos p
            on p.id_permiso = rp.id_permiso
            group by r.id_rol
            order by 1 asc `;
        //const query = "select * from roles";
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        const { nombre, perms } = body;

        let query = `INSERT INTO roles (nombre) VALUES ($1) RETURNING *`;
        let values = [nombre];
        let response = await conn.query(query, values);
        query = `INSERT INTO roles_permisos(
          id_rol, id_permiso)
          VALUES ($1, $2)`;
        perms.map(async (id_permiso: any) => {
          values = [response.rows[0].id_rol, id_permiso];
          await conn.query(query, values);
        });
        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: "Method is not supported" });
  }
}
