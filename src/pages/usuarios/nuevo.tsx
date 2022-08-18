import * as React from "react";
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";

function Input({ ...props }: any) {
  return (
    <input
      className="w-full appearance-none bg-transparent border-b-2 focus:border-white border-black text-white p-2 placeholder-white leading-tight focus:outline-none"
      {...props}
    />
  );
}

export default function Nuevo({ open, setOpen }: any) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="bg-gray-900 text-white">
          Agregar Usuario
        </DialogTitle>

        <div className="bg-gray-700 space-y-4 w-full p-8 pt-4 ">
          <Input type="text" placeholder="Nombre" aria-label="nombre" />
          <Input type="email" placeholder="Email" aria-label="email" />
          <Input
            type="password"
            placeholder="Contraseña"
            aria-label="password"
          />
          <Input
            type="password"
            placeholder="Confirmar Contraseña"
            aria-label="password confirmation"
          />
        </div>
        <DialogActions className="bg-gray-900">
          <Button
            onClick={handleClose}
            className="normal-case hover:ring-teal-700 hover:ring-1 group flex items-center rounded-md text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleClose}
            className="normal-case hover:bg-teal-700 group flex items-center rounded-md bg-teal-900 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
