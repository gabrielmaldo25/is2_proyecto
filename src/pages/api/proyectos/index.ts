// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { conn } from 'src/utils/database';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  switch (method) {
    case 'GET':
      try {
        const query = `select * from proyectos`;
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'POST':
      try {
        const { nombre, descripcion, participantes } = body;
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
        /*  query = `INSERT INTO permiso_formulario(
          id_permiso, id_form)
          VALUES ($1, $2)`;
        forms.map(async (id: any) => {
          values = [response.rows[0].id_permiso, id];
          await conn.query(query, values);
        }); */
        console.log('res: ', response);
        return res.json(response.rows[0]);
      } catch (error: any) {
        console.log('ERROR: ', error);
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: 'Method is not supported' });
  }
}
