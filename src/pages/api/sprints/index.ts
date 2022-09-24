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
        join usuarios_proyectos up on us.id_backlog = up.id_backlog 
        where us.id_backlog = $1`; */
        /*  let query = `select * from sprints 
        where id_backlog = $1`; */ //el id del backlog del proyecto al que pertenece

        let query = `select s.*,e.estado estado from
        backlogs b join sprints s
        on b.id_backlog = s.id_backlog
        join estados_sprint e 
        on e.id_estado = s.id_estado
        where b.id_proyecto = $1`;
        let values = [id_proyecto];
        let response = await conn.query(query, values);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'POST':
      try {
        console.log('BODY: ', body);
        // return;
        const { nombre, fecha_inicio, fecha_fin, id_estado, id_backlog } = body;
        let values = [nombre, fecha_inicio, fecha_fin, id_estado, id_backlog];
        /*traer id de estado = En Curso */
        let query = `Select * from estados_sprint where estado = 'En Curso'`;
        let response = await conn.query(query);
        let id_aux = response?.rows[0].id_estado;
        /*Comparar el id de en curso con el id que se recibe */
        if (id_aux == id_estado) {
          let query = `Select id_estado from sprints where id_backlog = $1 `;
          response = await conn.query(query, [id_backlog]);
          let aux = response.rows?.filter((row: any) => row.id_estado == id_estado);
          /*Si ya existe un sprint en curso retorna un error */
          if (aux?.length > 0) {
            console.log('RETORNA ERROR');
            return res.status(404).json({ message: 'No se puede tener mas de un Sprint en curso' });
          }
        }
        query = `INSERT INTO sprints (nombre, fecha_inicio, fecha_fin, id_estado, id_backlog )
         VALUES ($1,$2,$3,$4,$5) RETURNING *`;
        response = await conn.query(query, values);
        console.log('RESSS: ', response);
        return res.json(response.rows[0]);
      } catch (error: any) {
        console.log('ERROR: ', error);
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: 'Method is not supported' });
  }
}
