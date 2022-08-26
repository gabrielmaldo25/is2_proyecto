// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  switch (method) {
    case "GET":
      try {
        /*  const query = `select p.*, f.nombre_form 
from permisos p left join permiso_formulario pf
on p.id_permiso = pf.id_permiso
left join formularios f 
on pf.id_form = f.id_form `;*/
        const query = "select * from permisos";
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        const { descripcion, forms } = body;

        let query = `INSERT INTO permisos (descripcion) VALUES ($1) RETURNING *`;
        let values = [descripcion];
        let response = await conn.query(query, values);
        query = `INSERT INTO permiso_formulario(
          id_permiso, id_form)
          VALUES ($1, $2)`;
        forms.map(async (id: any) => {
          values = [response.rows[0].id_permiso, id];
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
