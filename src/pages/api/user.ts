import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  isLoggedIn: boolean;
  name: string;
  email: string;
  id_user: any;
  password: string;
  id_rol: any;
  proyectos: boolean;
  usuarios: boolean;
  seguridad: boolean;
  // screens: Array<object>;
};

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed

    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      name: "",
      email: "",
      id_user: null,
      password: "",
      id_rol: null,
      screens: [],
    });
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
