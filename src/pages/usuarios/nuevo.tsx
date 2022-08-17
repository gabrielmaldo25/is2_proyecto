import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Nuevo({ open, setOpen }: any) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Agrega un nuevo usuario a la Plataforma.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="name"
            label="Contraseña"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="name"
            label="Confirmar Contraseña"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            style={{ textTransform: "none" }}
            onClick={handleClose}
            className="hover:bg-teal-700 hover:text-white group flex items-center rounded-md text-teal-900 text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
          >
            Cancelar
          </Button>
          <Button
            style={{ textTransform: "none" }}
            onClick={handleClose}
            className="hover:bg-teal-700 group flex items-center rounded-md bg-teal-900 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
