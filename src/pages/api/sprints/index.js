// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isNilorEmpty } from 'src/helpers';
import { conn } from 'src/utils/database';

// eslint-disable-next-line import/no-anonymous-default-export

async function recuperarHistorias(id_sprint) {
  let query2 = `select us.*, e.estado
  from user_stories us
  join estados_us e
  on us.id_estado = e.id_estado
  where id_sprint = $1
  and estado = 'Backlog'`;
  let values = [id_sprint];
  let response = await conn.query(query2, values);
  return response.rows;
}

let retornarBacklog = async (id_proyecto) => {
  let query = 'select id_backlog from backlogs where id_proyecto = $1';
  let res = await conn.query(query, [id_proyecto]);
  return { idBacklog: res.rows[0].id_backlog };
};

export default async function (req, res) {
  const { method, body, query } = req;
  const { id_proyecto } = query;
  const { idBacklog } = await retornarBacklog(id_proyecto);
  switch (method) {
    case 'GET':
      try {
        /*Primero ver si existe un sprint en curso y si ese sprint en curso ya supero su fecha limite */
        let query1 = `select s.*,e.estado, current_date
        from sprints s
        join estados_sprint e
        on e.id_estado = s.id_estado
         `;
        let query2 =
          query1 +
          `where e.estado ilike 'en curso'
        and s.id_backlog = $1`;
        let values = [idBacklog];
        let response = await conn.query(query2, values);
        let stories = [];
        let ban = false;
        let idSprint = null;

        while (true) {
          if (response.rows.length > 0) {
            idSprint = response.rows[0]?.id_sprint;
            if (
              !isNilorEmpty(response.rows[0].fecha_fin) &&
              response.rows[0].current_date >= response.rows[0].fecha_fin
            ) {
              ban = true;
              //Sprint caducado entonces recuperar las historias sin finalizar de ese sprint y moverlas al siguiente
              let aux = await recuperarHistorias(idSprint);
              stories = stories.concat(aux.map((story) => story.id_us));
              //SE TIENE QUE CERRAR EL SPRINT, mover las historias sin finalizar al siguiente y ACTUALIZAR EL SIGUIENTE EN LA LISTA COMO EN CURSO
              query2 = `Update sprints set id_estado = 7 where id_sprint = $1`; //id 7 es de cerrado
              let r = await conn.query(query2, [idSprint]);

              query2 =
                query1 +
                `where e.estado = 'Backlog'
              and s.id_backlog = $1
              order by 1
              limit 1`;
              values = [idBacklog];
              response = await conn.query(query2, values);
            } else {
              break;
            }
          } else {
            if (ban) {
              //si no hay sprint en backlog pero si hay historias pendientes, crear un sprint nuevo y mover las historias ahí
              let q = `Insert into sprints (nombre, id_backlog, id_estado) values ('Sprint automatico', $1, 6)`;
              let res = await conn.query(q, [idBacklog]);
              idSprint = res.rows[0].id_sprint;
            }
            break;
          }
        }

        if (ban) {
          //poner el nuevo sprint en curso
          query2 = `Update sprints set id_estado = 6 where id_sprint = $1`; //id 6 es EN CURSO
          await conn.query(query2, [idSprint]);
        }

        //si hay historias pendientes actualizar su sprint
        if (stories.length > 0) {
          stories.map(async (story) => {
            query2 = `update user_stories set id_sprint = $1 where id_us = $2`;
            await conn.query(query2, [idSprint, story]);
          });
        }

        let query = `select s.*,e.estado estado from
        backlogs b join sprints s
        on b.id_backlog = s.id_backlog
        join estados_sprint e 
        on e.id_estado = s.id_estado
        where b.id_proyecto = $1`;
        response = await conn.query(query, [id_proyecto]);
        return res.json(response.rows);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    case 'POST':
      try {
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
          let aux = response.rows?.filter((row) => row.id_estado == id_estado);
          /*Si ya existe un sprint en curso retorna un error */
          if (aux?.length > 0) {
            return res.status(404).json({ message: 'No se puede tener mas de un Sprint en curso' });
          }
        }
        query = `INSERT INTO sprints (nombre, fecha_inicio, fecha_fin, id_estado, id_backlog )
         VALUES ($1,$2,$3,$4,$5) RETURNING *`;
        response = await conn.query(query, values);
        return res.json(response.rows[0]);
      } catch (error) {
        return res.status(400).json({ message: error.message || error.error });
      }
    default:
      return res.status(400).json({ message: 'Method is not supported' });
  }
}
