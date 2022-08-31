// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { isNilorEmpty } from 'src/helpers';
import { conn } from 'src/utils/database';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  switch (method) {
    case 'GET':
      try {
        let query = `select pr.*, json_agg(row_to_json(u)::jsonb - 'password') filter (where u.id_user is not null) participantes
        from proyectos pr
        left join usuarios_proyectos up
        on pr.id_proyecto = up.id_proyecto
        left join usuarios u 
        on u.id_user = up.id_user
        group by pr.id_proyecto
        order by 1 asc
            `;
        //const query = `select * from proyectos`;
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'POST':
      try {
        const { nombre, descripcion, participantes } = body;
        //Crear proyecto
        let values = [nombre];
        let query = `INSERT INTO proyectos (nombre`;
        if (descripcion) query += `,descripcion`;
        query += `) VALUES ($1 `;
        if (descripcion) {
          query += `,$2`;
          values.push(descripcion);
        }
        query += `) RETURNING *`;

        let response = await conn.query(query, values);
        //Asignar participantes al proyecto si existen
        if (!isNilorEmpty(participantes)) {
          query = `INSERT INTO usuarios_proyectos(
                id_user, id_proyecto)
                VALUES ($1, $2)`;
          participantes.map(async (id: any) => {
            values = [id, response.rows[0].id_proyecto];
            await conn.query(query, values);
          });
        }
        //Crear un backlog para el proyecto
        query = `INSERT INTO backlogs (id_proyecto) VALUES ($1)`;
        values = [response.rows[0].id_proyecto];
        await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        console.log('ERROR: ', error);
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: 'Method is not supported' });
  }
}
