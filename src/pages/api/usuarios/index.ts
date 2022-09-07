// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { conn } from 'src/utils/database';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  switch (method) {
    case 'GET':
      try {
        const query = `select u.*,
        json_agg(json_build_object('id_rol',r.id_rol,'nombre',r.nombre,
                   'valido_desde',ur.valido_desde,
                   'valido_hasta',ur.valido_hasta )) as Rol
            from usuarios u left join usuario_rol ur on u.id_user = ur.id_user
            left join roles r on r.id_rol = ur.id_rol
        group by u.id_user
            order by 1 asc`;
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'POST':
      try {
        const { name, email, password, rol } = body;
        let query = 'INSERT INTO usuarios(name, email, password) VALUES ($1, $2, $3) RETURNING *';
        let values = [name, email, password];
        let response = await conn.query(query, values);
        query = 'INSERT INTO usuario_rol (id_user,id_rol,valido_desde,valido_hasta) VALUES ($1, $2, $3,$4)';
        values = [response.rows[0].id_user, rol.id, new Date().toLocaleDateString(), rol.valido_hasta];
        await conn.query(query, values);
        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: 'Method is not supported' });
  }
}
