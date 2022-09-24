import { NextApiRequest, NextApiResponse } from 'next';
import { conn } from 'src/utils/database';
import { isNilorEmpty } from 'src/helpers';
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    body,
    query: { id },
  } = req;

  switch (method) {
    case 'GET':
      try {
        const text = 'SELECT * FROM sprints WHERE id_sprint = $1';
        const values = [id];
        const result = await conn.query(text, values);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Sprint no encontrado' });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'PUT':
      try {
        const { nombre, fecha_inicio, fecha_fin, id_estado, id_backlog } = body;
        let values = [nombre, fecha_inicio, fecha_fin, id_estado, id_backlog, id];
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

        query = `Update sprints set nombre = $1, fecha_inicio = $2, fecha_fin = $3, id_estado=$4, id_backlog = $5
         where id_sprint = $6 RETURNING *`;
        response = await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        console.log('ERRROR; ', error);
        return res.status(400).json({ message: error.message });
      }
    case 'DELETE':
      try {
        const values = [id];
        let text = 'DELETE FROM sprints WHERE id_sprint = $1';
        let result = await conn.query(text, values);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Sprint no encontrado' });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: 'Método inválido.' });
  }
};
