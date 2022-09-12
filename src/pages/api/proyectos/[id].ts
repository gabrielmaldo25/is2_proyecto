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
        const text = `SELECT pr.*,b.id_backlog
        FROM proyectos pr
        join backlogs b
        on pr.id_proyecto = b.id_proyecto
        WHERE pr.id_proyecto = $1`;
        const values = [id];
        const result = await conn.query(text, values);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Proyecto no encontrado' });

        return res.json(result.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case 'PUT':
      try {
        const { nombre, descripcion, participantes } = body;
        let values = [nombre, descripcion, id];
        let text = 'UPDATE proyectos SET nombre = $1, descripcion = $2 WHERE id_proyecto = $3 RETURNING *  ';
        const response = await conn.query(text, values);

        text = `delete from usuarios_proyectos where id_proyecto = $1`;
        values = [id];
        await conn.query(text, values);
        //Asignar participantes al proyecto si existen
        if (!isNilorEmpty(participantes)) {
          text = `INSERT INTO usuarios_proyectos(
                id_user, id_proyecto)
                VALUES ($1, $2)`;
          participantes.map(async (id: any) => {
            values = [id, response.rows[0].id_proyecto];
            await conn.query(text, values);
          });
        }

        return res.json(response.rows[0]);
      } catch (error: any) {
        console.log('ERROR AL ACTUALIZAR; ', error);
        return res.status(400).json({ message: error.message });
      }
    case 'DELETE':
      try {
        const values = [id];
        let text = `select s.* 
        from sprints s
        join backlogs b
        on b.id_backlog = s.id_backlog
        where fecha_fin < current_date
        and b.id_proyecto = $1`;
        let res1 = await conn.query(text, values);
        if (res1.rowCount > 0)
          return res.status(404).json({ message: 'No se puede borrar este proyecto. Tiene sprint abierto' });
        else {
          text = `delete from backlogs where id_proyecto = $1`;
          await conn.query(text, values);
          text = `delete from usuarios_proyectos where id_proyecto = $1`;
          await conn.query(text, values);
          text = `delete from proyectos where id_proyecto = $1`;
          await conn.query(text, values);
        }
        return res.status(200).json({ message: 'Eliminado exitosamente', success: true });
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }

    default:
      return res.status(400).json({ message: 'Método inválido.' });
  }
};
