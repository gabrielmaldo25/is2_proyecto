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
        const { nombre, perms } = body;
        let query = 'UPDATE roles SET nombre = $1 WHERE id_rol = $2 RETURNING *';
        let values = [nombre, id];
        let response = await conn.query(query, values);
        query = 'delete from roles_permisos where id_rol = $1';
        values = [id];
        await conn.query(query, values);
        query = `INSERT INTO roles_permisos(
          id_rol, id_permiso)
          VALUES ($1, $2)`;
        perms.map(async (id_permiso: any) => {
          values = [response.rows[0].id_rol, id_permiso];
          await conn.query(query, values);
        });
        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'DELETE':
      try {
        const values = [id];
        let text = 'DELETE FROM roles_permisos WHERE id_rol = $1';
        let result = await conn.query(text, values);
        if (result.rowCount > 0) return res.status(404).json({ message: 'No se puede borrar este permiso' });


        text = 'delete from roles where id_rol = $1';
        result = await conn.query(text, values);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Rol no encontrado' });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: 'Método inválido.' });
  }
};
