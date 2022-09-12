import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';
import { Sprint } from 'src/interfaces/interfaces';
import { isNilorEmpty } from 'src/helpers';
import Alert from '@mui/material/Alert';

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
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

type ChangeInputHandler = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export default function ABMSprint({
  open,
  setOpen,
  setSprint,
  sprint = null,
  refetchSprints,
  id_backlog,
}: {
  open: any;
  setOpen: any;
  setSprint: any;
  sprint?: any;
  refetchSprints: any;
  id_backlog: any;
}) {
  const inititalState = {
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    id_estado: null,
    id_backlog: id_backlog,
  };
  const [currentSprint, setCurrentSprint] = useState<Sprint>(inititalState);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [estados, setEstados] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/extra/estados')
      .then((res) => res.json())
      .then((data) => {
        setEstados(data);
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isNilorEmpty(sprint) && !isNilorEmpty(estados))
      setCurrentSprint({ ...currentSprint, id_estado: estados[0].id_estado });
  }, [estados]);

  useEffect(() => {
    sprint !== null ? setCurrentSprint({ ...sprint }) : null;
  }, [sprint]);

  const handleClose = () => {
    sprint ? setSprint(null) : null;
    setOpen(false);
  };

  const createSprint = async (currentSprint: Sprint) => {
    let payload = { ...currentSprint };
    await fetch('http://localhost:3000/api/sprints', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const updateSprint = async (id: any, currentSprint: Sprint) => {
    let payload = { ...currentSprint };

    await fetch('http://localhost:3000/api/sprints/' + id, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/historias/' + sprint.id_us, {
        method: 'DELETE',
      });
      refetchSprints();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) =>
    setCurrentSprint({ ...currentSprint, [name]: value });

  function afterSaved() {
    setCurrentSprint(inititalState);
    refetchSprints();
    setSprint(null);
    setOpen(false);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (sprint?.hasOwnProperty('id_us')) {
        updateSprint(sprint.id_us, currentSprint);
      } else {
        createSprint(currentSprint);
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
        <DialogTitle className="bg-gray-900 text-white">{sprint ? 'Editar Sprint' : ' Agregar Sprint'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="bg-sand-300 space-y-4 w-full p-8 pt-4 ">
            <Input
              type="text"
              placeholder="Nombre"
              name="nombre"
              onChange={handleChange}
              value={currentSprint.nombre}
              required
            />
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col">
                <text className="text-lg bg-transparent">Inicio</text>
                <input
                  //onChange={(e: any) => setSelectedRol({ ...selectedRol, valido_hasta: e.target.value })}
                  type="date"
                  className="bg-transparent ring-1 p-2 rounded-sm ring-gray-500"
                  name="fecha_inicio"
                  onChange={handleChange}
                  value={currentSprint.fecha_inicio}
                />
              </div>
              <div className="flex flex-col">
                <text className="text-lg bg-transparent">Fin </text>
                <input
                  //onChange={(e: any) => setSelectedRol({ ...selectedRol, valido_hasta: e.target.value })}
                  type="date"
                  className="bg-transparent ring-1 p-2 rounded-sm ring-gray-500"
                  name="fecha_fin"
                  onChange={handleChange}
                  value={currentSprint.fecha_fin}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <text className="text-lg">Estado</text>
              <Select
                value={currentSprint.id_estado}
                onChange={(event: SelectChangeEvent<any>) =>
                  setCurrentSprint({ ...currentSprint, id_estado: event.target.value })
                }
                input={<OutlinedInput label="Tag" />}
                MenuProps={MenuProps}
              >
                {!isNilorEmpty(estados) &&
                  estados.map((estado: any) => (
                    <MenuItem key={estado.id_estado} value={estado.id_estado}>
                      <ListItemText primary={estado.estado} />
                    </MenuItem>
                  ))}
              </Select>
            </div>
            {errorMessage && (
              <Alert variant="outlined" severity="error">
                {errorMessage}
              </Alert>
            )}
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
              {sprint ? 'Actualizar' : 'Guardar'}
            </Button>
            {sprint && (
              <Button onClick={() => setOpenDelete(true)} className="normal-case" color="warning">
                Eliminar Historia
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle className="bg-gray-900 text-white">Eliminar Historia</DialogTitle>
        <div className="bg-gray-900 text-white p-4">
          <text>Estas seguro de que quieres eliminar esta historia?</text>
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
