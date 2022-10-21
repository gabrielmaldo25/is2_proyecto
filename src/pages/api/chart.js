// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isNilorEmpty } from 'src/helpers';
import { conn } from 'src/utils/database';

// eslint-disable-next-line import/no-anonymous-default-export

let retornarBacklog = async (id_proyecto) => {
  let query = 'select id_backlog from backlogs where id_proyecto = $1';
  let res = await conn.query(query, [id_proyecto]);
  return { idBacklog: res.rows[0].id_backlog };
};

export default async function (req, res) {
  const { method, body, query } = req;
  const { id_proyecto } = query;
  console.log('ID LLEGA: ', id_proyecto);

  const { idBacklog } = await retornarBacklog(id_proyecto);
  switch (method) {
    case 'GET':
      try {
        //recuperar los id de los sprints del proyecto
        let aux = `select id_sprint from sprints where id_backlog = $1`;
        let response = await conn.query(aux, [idBacklog]);
        let sprints = [];
        if (response.rowCount > 0) {
          sprints = response.rows.map((sprint) => sprint.id_sprint);
        }

        let query = `with contar as (`;

        //recuperar datos para el chart
        if (sprints.length > 0) {
          let params = sprints.join(',');
          query += `
            select  s.id_sprint, s.nombre sprint,  count(e.estado) abierto , 0 cerrado  
            from user_stories us
            right outer join sprints s
            on us.id_sprint = s.id_sprint
            left join estados_us e
            on us.id_estado = e.id_estado and e.estado != 'Done'
            where s.id_sprint in (${params})
            group by s.id_sprint, sprint
            union
            select  s.id_sprint, s.nombre sprint,  0 abierto , count(e.estado) cerrado  
            from user_stories us
            right outer join sprints s
            on us.id_sprint = s.id_sprint
            left join estados_us e
            on us.id_estado = e.id_estado and e.estado = 'Done'
            where s.id_sprint in (${params})
            group by s.id_sprint, sprint
            union
            `;
        }

        query += `select  null id_sprint, 'Backlog' sprint,  count(us.id_us) abierto , 0 cerrado  
        from user_stories us
        join estados_us e
        on us.id_estado = e.id_estado 
        where id_proyecto = $1
        and e.estado != 'Done'
        and us.id_sprint is null
        group by id_sprint, sprint
        union
        select  null id_sprint, 'Backlog' sprint,  0 abierto , count(us.id_us) cerrado  
        from user_stories us
        join estados_us e
        on us.id_estado = e.id_estado 
        where id_proyecto = $1
        and e.estado = 'Done'
        and us.id_sprint is null
        group by id_sprint, sprint
        )
        select id_sprint, sprint, sum(abierto) abierto, sum(cerrado) cerrado from contar
        group by id_sprint,sprint
        order by id_sprint`;
        let respuesta = await conn.query(query, [id_proyecto]);
        return res.json(respuesta.rows);
      } catch (error) {
        console.log('ERROR: ', error);
        return res.status(400).json({ message: error.message });
      }

    default:
      return res.status(400).json({ message: 'Method is not supported' });
  }
}
