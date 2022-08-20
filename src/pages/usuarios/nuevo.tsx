import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { Usuario } from "src/interfaces/interfaces";
import * as bcrypt from "bcryptjs";

function Input({ ...props }: any) {
  return (
    <input
      className="w-full appearance-none bg-transparent border-b-2 focus:border-green-300 border-black text-black p-2 placeholder-green-800 leading-tight focus:outline-none"
      {...props}
    />
  );
}

type ChangeInputHandler = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const inititalState = {
  name: "",
  email: "",
  password: "",
};

export default function Nuevo({
  open,
  setOpen,
  setUser,
  user = null,
  refetchUsers,
}: {
  open: any;
  setOpen: any;
  setUser: any;
  user?: any;
  refetchUsers: any;
}) {
  const [usuario, setUsuario] = useState<Usuario>(inititalState);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("USUARIO: ", user);
    user !== null ? setUsuario(user) : null;
  }, [user]);
  const handleClose = () => {
    user ? setUser(null) : null;
    setOpen(false);
  };
  const createUser = async (usuario: Usuario) => {
    const { password, ...restOfUser } = usuario;
    const encrypted = await bcrypt.hash(password, 5);
    //const encrypted = password;
    console.log(
      "PA ENVIAR: ",
      JSON.stringify({ password: encrypted, ...restOfUser })
    );
    await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      body: JSON.stringify({ password: encrypted, ...restOfUser }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const updateUser = async (id: any, usuario: Usuario) =>
    await fetch("http://localhost:3000/api/usuarios/" + id, {
      method: "PUT",
      body: JSON.stringify(usuario),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) =>
    setUsuario({ ...usuario, [name]: value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.hasOwnProperty("id_user")) {
        updateUser(user.id_user, usuario);
      } else {
        createUser(usuario);
      }
      setUsuario(inititalState);
      refetchUsers();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="bg-gray-900 text-white">
          Agregar Usuario
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="bg-sand-300 space-y-4 w-full p-8 pt-4 ">
            <Input
              type="text"
              placeholder="Nombre"
              name="name"
              onChange={handleChange}
              value={usuario.name}
            />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={usuario.email}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              name="password"
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="Confirmar Contraseña"
              name="passwordConfirmation"
            />
          </div>
          <DialogActions className="bg-gray-900">
            <Button
              onClick={handleClose}
              className="normal-case hover:ring-green-800 hover:ring-1 group flex items-center rounded-md text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              Cancelar
            </Button>
            <Button
              //onClick={handleClose}
              className="normal-case hover:bg-green-600 group flex items-center rounded-md bg-green-800 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
              type="submit"
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
