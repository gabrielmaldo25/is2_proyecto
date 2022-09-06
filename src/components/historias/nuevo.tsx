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
import { UserStory } from 'src/interfaces/interfaces';
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

export default function NuevoUS({
  open,
  setOpen,
  setUserStory,
  userStory = null,
  refetchUStories,
  id_proyecto,
}: {
  open: any;
  setOpen: any;
  setUserStory: any;
  userStory?: any;
  refetchUStories: any;
  id_proyecto: any;
}) {
  const inititalState = {
    id_sprint: null,
    nombre: '',
    descripcion: '',
    id_estado: '',
    id_user: null,
    id_proyecto: id_proyecto,
  };
  const [currentUS, setCurrentUS] = useState<UserStory>(inititalState);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = React.useState<any>();
  const [usuarios, setUsuarios] = useState([]);
  const [estados, setEstados] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<any>(null);

  useEffect(() => {
    if (userStory && userStory.id_user) {
      setSelectedUsuario(userStory.id_user);
    }
  }, [userStory]);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/usuarios?id_proyecto=${id_proyecto}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
      });
    fetch('/api/extra/estados')
      .then((res) => res.json())
      .then((data) => {
        setEstados(data);
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isNilorEmpty(userStory) && !isNilorEmpty(estados))
      setCurrentUS({ ...currentUS, id_estado: estados[0].id_estado });
  }, [estados]);

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;
    setSelectedUsuario(value);
  };

  useEffect(() => {
    userStory !== null ? setCurrentUS({ ...userStory }) : null;
  }, [userStory]);
  const handleClose = () => {
    userStory ? setUserStory(null) : null;
    setOpen(false);
  };
  const createUS = async (currentUS: UserStory) => {
    let payload = { ...currentUS };
    await fetch('http://localhost:3000/api/historias', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  const updateUS = async (id: any, currentUS: UserStory) => {
    let payload = { ...currentUS };

    await fetch('http://localhost:3000/api/historias/' + id, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/historias/' + userStory.id_us, {
        method: 'DELETE',
      });
      refetchUStories();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) =>
    setCurrentUS({ ...currentUS, [name]: value });

  function afterSaved() {
    setCurrentUS(inititalState);
    refetchUStories();
    setUserStory(null);
    setOpen(false);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (userStory?.hasOwnProperty('id_us')) {
        updateUS(userStory.id_us, currentUS);
      } else {
        createUS(currentUS);
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
          {userStory ? 'Editar UserStory' : ' Agregar UserStory'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="bg-sand-300 space-y-4 w-full p-8 pt-4 ">
            <Input
              type="text"
              placeholder="Nombre"
              name="nombre"
              onChange={handleChange}
              value={currentUS.nombre}
              required
            />
            <Input
              type="text"
              placeholder="Descripcion"
              name="descripcion"
              onChange={handleChange}
              value={currentUS.descripcion}
            />
            <div className="flex flex-col">
              <text className="text-lg">Asignar a </text>
              <Select
                value={currentUS.id_user}
                onChange={(e: any) => setCurrentUS({ ...currentUS, id_user: e.target.value })}
                input={<OutlinedInput label="Tag" />}
                MenuProps={MenuProps}
              >
                {!isNilorEmpty(usuarios) &&
                  usuarios.map((user: any) => (
                    <MenuItem key={user.id_user} value={user.id_user}>
                      <ListItemText primary={user.name} />
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div className="flex flex-col">
              <text className="text-lg">Sprint?</text>
              <Select
                value={selectedUsuario}
                onChange={(e: any) => setSelectedUsuario(e.target.value)}
                input={<OutlinedInput label="Tag" />}
                MenuProps={MenuProps}
              >
                {!isNilorEmpty(usuarios) &&
                  usuarios.map((user: any) => (
                    <MenuItem key={user.id_user} value={user.id_user}>
                      <ListItemText primary={user.name} />
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div className="flex flex-col">
              <text className="text-lg">Estado</text>
              <Select
                value={currentUS.id_estado}
                onChange={(event: SelectChangeEvent<any>) =>
                  setCurrentUS({ ...currentUS, id_estado: event.target.value })
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
              {userStory ? 'Actualizar' : 'Guardar'}
            </Button>
            {userStory && (
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
