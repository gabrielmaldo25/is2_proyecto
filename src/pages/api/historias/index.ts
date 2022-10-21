// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { conn } from 'src/utils/database';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { id_proyecto } = query;
  switch (method) {
    case 'GET':
      try {
        /* let query = `select us.* from user_stories us
        join usuarios_proyectos up on us.id_proyecto = up.id_proyecto 
        where us.id_proyecto = $1`; */
        let query = `select us.*, e.estado estado, row_to_json(u)::jsonb - 'password' usuario 
        from user_stories us
        left join usuarios u
        on u.id_user = us.id_user
        left join estados_us e 
        on e.id_estado = us.id_estado
        where us.id_proyecto = $1`;
        let values = [id_proyecto];
        let response = await conn.query(query, values);
        console.log(response.rows, "holaa");
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'POST':
      try {
        const { nombre, descripcion, id_estado, id_proyecto, id_user, id_sprint } = body;
        let values = [nombre, descripcion, id_estado, id_proyecto, id_user, id_sprint];

        let query = `INSERT INTO user_stories (nombre, descripcion, id_estado, id_proyecto, id_user, id_sprint )
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        let response = await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        console.log('ERROR: ', error);
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: 'Method is not supported' });
  }
}
