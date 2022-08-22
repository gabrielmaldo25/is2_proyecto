import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
import { Permiso } from "src/interfaces/interfaces";
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
  descripcion: "",
  id_form: "",
};

export default function Nuevo({
  open,
  setOpen,
  setPermission,
  permission = null,
  refetchPermissions,
}: {
  open: any;
  setOpen: any;
  setPermission: any;
  permission?: any;
  refetchPermissions: any;
}) {
  const [permiso, setPermiso] = useState<Permiso>(inititalState);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    permission !== null ? setPermiso(permiso) : null;
  }, [permiso, permission]);
  const handleClose = () => {
    permission ? setPermission(null) : null;
    setOpen(false);
  };
  const createPermiso = async (permiso: Permiso) => {

    await fetch("http://localhost:3000/api/permisos", {
      method: "POST",
      body: JSON.stringify({ permiso }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const updatePermiso = async (id: any, permiso: Permiso) =>
    await fetch("http://localhost:3000/api/permisos/" + id, {
      method: "PUT",
      body: JSON.stringify(permiso),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const handleDelete = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/permisos/" + permission.id_permiso,
        {
          method: "DELETE",
        }
      );
      refetchPermissions();
      setOpenDelete(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) =>
    setPermiso({ ...permiso, [name]: value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
      try {
        if (permission?.hasOwnProperty("id_permiso")) {
          updatePermiso(permission.id_permiso, permiso);
        } else {
          createPermiso(permiso);
        }
        setPermiso(inititalState);
        refetchPermissions();
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
          Agregar Permiso
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="bg-sand-300 space-y-4 w-full p-8 pt-4 ">
            <Input
              type="text"
              placeholder="Descripcion"
              name="descripcion"
              onChange={handleChange}
              value={permiso.descripcion}
              required
            />
            {/* <Input
              type="text"
              placeholder="Formulario"
              name="formulario"
              onChange={handleChange}
              value={permiso.id_form}
              required
            /> */}
          </div>
          <DialogActions className="bg-gray-900">
            <Button
              onClick={handleClose}
              className="normal-case hover:ring-green-800 hover:ring-1 group flex items-center rounded-md text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              Cancelar
            </Button>
            <Button
              className="normal-case hover:bg-green-600 group flex items-center rounded-md bg-green-800 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
              type="submit"
            >
              Actualizar
            </Button>
            {permission && (
              <Button
                onClick={() => setOpenDelete(true)}
                className="normal-case"
                color="warning"
              >
                Eliminar Permiso
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle className="bg-gray-900 text-white">
          Eliminar Permiso
        </DialogTitle>
        <div className="bg-gray-900 text-white p-4">
          <text>Estas seguro de que quieres eliminar este permiso?</text>
        </div>
        <DialogActions className="bg-gray-900">
          <Button
            onClick={handleCloseDelete}
            className="normal-case hover:ring-green-800 hover:ring-1 group flex items-center rounded-md text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            className="normal-case hover:bg-green-600 group flex items-center rounded-md bg-green-800 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}