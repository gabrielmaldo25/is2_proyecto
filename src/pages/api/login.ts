import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";
import { authServiceFactory } from "../../../services/authService";
import * as bcrypt from "bcryptjs";

const authService = authServiceFactory();
export let screens: { rows: { nombre_form: string; }[]; } 

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        const { email, password } = await req.body;
        let query = "select u.*, ur.id_rol from usuarios u"
        + " join usuario_rol ur on ur.id_user = u.id_user"
        + " join roles r on r.id_rol = ur.id_rol"
        + " where u.email = $1";
        const values = [email];
        const response = await conn.query(query, values);

        const query_screens = "select distinct(f.nombre_form) from roles_permisos rp"
        + " join permiso_formulario pf on pf.id_permiso = rp.id_permiso"
        + " join formularios f on f.id_form = pf.id_form"
        + " where rp.id_rol = $1";
        const value = [response.rows[0].id_rol]
        screens = await conn.query(query_screens, value);

        // console.log(screens.rows[0]);
        const user = { isLoggedIn: true, proyectos: screens.rows.find(({ nombre_form }) => nombre_form === 'Proyectos') ? true : false,
        usuarios: screens.rows.find(({ nombre_form }) => nombre_form === 'Usuarios') ? true : false,
        seguridad: screens.rows.find(({ nombre_form }) => nombre_form === 'Seguridad') ? true : false,
         ...response.rows[0] } as User;

        if (
          (await authService.validate(password, response.rows[0].password)) ===
          true
        ) {
          req.session.user = user;
          await req.session.save();
          return res.json(user);
        } else {
          return res.status(400).json({ error: "BAD LOGIN" });
        }
      } catch (error) {
        return res.status(400).json({ message: "INVALID" }); //en fetchJson.ts lee por message, no se si cambiar el resto porque directo cae acá cuando hay error
      }
    default:
      return res.status(400).json({ error: "INVALID" });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
