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
        const { nombre, descripcion, id_estado, id_proyecto, id_user, id_sprint } = body;
        let values = [
          nombre,
          descripcion,
          id_estado,
          id_proyecto,
          isNilorEmpty(id_user) ? null : id_user,
          id_sprint,
          id,
        ];

        let query = `Update user_stories set nombre = $1, descripcion = $2, id_estado = $3, id_proyecto=$4, id_user = $5, id_sprint = $6
         where id_us = $7 RETURNING *`;
        let response = await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'DELETE':
      try {
        const values = [id];
        let text = 'DELETE FROM user_stories WHERE id_us = $1';
        let result = await conn.query(text, values);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Rol no encontrado' });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: 'Método inválido.' });
  }
};
