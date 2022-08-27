import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  Checkbox,
  OutlinedInput,
  ListItemText,
  SelectChangeEvent,
  Chip,
  Box,
} from "@mui/material";
import { Rol } from "src/interfaces/interfaces";
import * as bcrypt from "bcryptjs";
import { GetServerSideProps } from "next";
import { isNilorEmpty } from "src/helpers";
import { xorBy } from "lodash";
function Input({ ...props }: any) {
  return (
    <input
      className="w-full appearance-none bg-transparent border-b-2 focus:border-green-300 border-black text-black p-2 placeholder-green-800 leading-tight focus:outline-none"
      {...props}
    />
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

type ChangeInputHandler = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const inititalState = {
  nombre: "",
  perms: [],
};

export default function Nuevo({
  open,
  setOpen,
  setRol,
  rol = null,
  refetchRoles,
}: {
  open: any;
  setOpen: any;
  setRol: any;
  rol?: any;
  refetchRoles: any;
}) {
  const [currentRol, setCurrentRol] = useState<Rol>(inititalState);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPermisos, setSelectedPermisos] = React.useState<any[]>([]);
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    if (rol) {
      setSelectedPermisos(rol.permisos.map((i: any) => i.id_permiso));
    }
  }, [rol]);
  useEffect(() => {
    setLoading(true);
    fetch("/api/permisos")
      .then((res) => res.json())
      .then((data) => {
        setPermisos(data);
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;

    setSelectedPermisos(value);
  };

  useEffect(() => {
    rol !== null ? setCurrentRol({ ...rol }) : null;
  }, [rol]);
  const handleClose = () => {
    rol ? setRol(null) : null;
    setOpen(false);
  };
  const createRol = async (currentRol: Rol) => {
    let payload = { nombre: currentRol.nombre, perms: selectedPermisos };
    await fetch("http://localhost:3000/api/roles", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const updateRol = async (id: any, currentRol: Rol) => {
    let payload = { nombre: currentRol.nombre, perms: selectedPermisos };

    await fetch("http://localhost:3000/api/roles/" + id, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/roles/" + rol.id_rol, {
        method: "DELETE",
      });
      refetchRoles();
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
    setCurrentRol({ ...currentRol, [name]: value });

  function afterSaved() {
    setCurrentRol(inititalState);
    refetchRoles();
    setRol(null);
    setOpen(false);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (rol?.hasOwnProperty("id_rol")) {
        updateRol(rol.id_rol, currentRol);
      } else {
        createRol(currentRol);
      }
      afterSaved();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="bg-gray-900 text-white">
          {rol ? "Editar Rol" : " Agregar Rol"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="bg-sand-300 space-y-4 w-full p-8 pt-4 ">
            <Input
              type="text"
              placeholder="Nombre"
              name="nombre"
              onChange={handleChange}
              value={currentRol.nombre}
              required
            />
            <div className="flex flex-col">
              <text className="text-lg">
                Selecciona el/los permisos que tiene este rol{" "}
              </text>
              <Select
                multiple
                value={selectedPermisos}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => (
                      <Chip
                        key={id}
                        label={
                          !isNilorEmpty(permisos)
                            ? permisos.find((e) => e.id_permiso === id)
                                .descripcion
                            : null
                        }
                      />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {!isNilorEmpty(permisos) &&
                  permisos.map((permiso: any) => (
                    <MenuItem
                      key={permiso.id_permiso}
                      value={permiso.id_permiso}
                    >
                      <Checkbox
                        checked={selectedPermisos.includes(permiso.id_permiso)}
                      />
                      <ListItemText primary={permiso.descripcion} />
                    </MenuItem>
                  ))}
              </Select>
            </div>
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
              disabled={isNilorEmpty(selectedPermisos)}
            >
              {rol ? "Actualizar" : "Guardar"}
            </Button>
            {rol && (
              <Button
                onClick={() => setOpenDelete(true)}
                className="normal-case"
                color="warning"
              >
                Eliminar Rol
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
          <text>Estas seguro de que quieres eliminar este rol?</text>
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
