import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";
import { authServiceFactory } from "../../../services/authService";
import * as bcrypt from "bcryptjs";

const authService = authServiceFactory();

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      try {
        const { email, password } = await req.body;
        const query = "SELECT * FROM usuarios where email = $1";
        const values = [email];
        const response = await conn.query(query, values);
        const user = { isLoggedIn: true, ...response.rows[0] } as User;

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
        return res.status(400).json({ error: (error as Error).message });
      }
    default:
      return res.status(400).json({ error: "INVALID" });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
