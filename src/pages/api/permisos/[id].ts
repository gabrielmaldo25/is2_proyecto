import { NextApiRequest, NextApiResponse } from 'next';
import { conn } from 'src/utils/database';

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
        const text = 'SELECT * FROM permisos WHERE id_user = $1';
        const values = [id];
        const result = await conn.query(text, values);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Permiso no encontrado' });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'PUT':
      try {
        const { descripcion, forms } = body;
        let query = 'UPDATE permisos SET descripcion = $1 WHERE id_permiso = $2 RETURNING *';
        let values = [descripcion, id];
        let response = await conn.query(query, values);
        values = [id];
        query = 'delete from permiso_formulario where id_permiso = $1';
        await conn.query(query, values);
        query = `INSERT INTO permiso_formulario(
          id_permiso, id_form)
          VALUES ($1, $2)`;
        forms.map(async (id: any) => {
          values = [response.rows[0].id_permiso, id];
          await conn.query(query, values);
        });
        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'DELETE':
      try {
        const values = [id];
        /* let text = 'DELETE FROM permiso_formulario WHERE id_permiso = $1 RETURNING *';
        await conn.query(text, values); */
        let text = 'delete from permisos where id_permiso = $1';

        const result = await conn.query(text, values);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Permiso no encontrado' });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: 'Método inválido.' });
  }
};
