import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
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
  TextareaAutosize,
} from '@mui/material';
import { Proyecto } from 'src/interfaces/interfaces';
import { isNilorEmpty } from 'src/helpers';
import Alert from '@mui/material/Alert';
import fetchJson, { FetchError } from 'lib/fetchJson';

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

type ChangeInputHandler = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const inititalState = {
  nombre: '',
  descripcion: '',
  participantes: [],
};

export default function Nuevo({
  open,
  setOpen,
  setProject,
  project = null,
  refetchProjects,
}: {
  open: any;
  setOpen: any;
  setProject: any;
  project?: any;
  refetchProjects: any;
}) {
  const [proyecto, setProyecto] = useState<Proyecto>(inititalState);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedParticipantes, setSelectedParticipantes] = React.useState<any[]>([]);
  const [formularios, setFormularios] = useState([]);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  useEffect(() => {
    if (project) {
      setSelectedParticipantes(project.formularios.map((i: any) => i.id_form));
    }
  }, [project]);
  useEffect(() => {
    setLoading(true);
    fetch('/api/formularios')
      .then((res) => res.json())
      .then((data) => {
        setFormularios(data);
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;

    setSelectedParticipantes(value);
  };

  useEffect(() => {
    project !== null ? setProyecto({ ...project }) : null;
  }, [project]);

  const handleClose = () => {
    project ? setProject(null) : null;
    setOpen(false);
  };

  const createProyecto = async (proyecto: Proyecto) => {
    let payload = { ...proyecto, participantes: selectedParticipantes };
    await fetch('http://localhost:3000/api/proyectos', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  const updateProyecto = async (id: any, proyecto: Proyecto) => {
    let payload = { ...proyecto, participantes: selectedParticipantes };

    await fetch('http://localhost:3000/api/proyectos/' + id, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const handleDelete = async () => {
    try {
      const res = await fetchJson('api/proyectos/' + project.id_proyecto, {
        method: 'DELETE',
      });
      refetchProjects();
      setOpenDelete(false);
    } catch (error) {
      handleCloseDelete();
      if (error instanceof FetchError) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage('An unexpected error happened:' + error);
      }
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) => setProyecto({ ...proyecto, [name]: value });

  function afterSaved() {
    setProyecto(inititalState);
    setProject(null);
    setOpen(false);
    refetchProjects();
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project?.hasOwnProperty('id_proyecto')) {
        updateProyecto(project.id_proyecto, proyecto);
      } else {
        createProyecto(proyecto);
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
          {project ? 'Editar Proyecto' : ' Agregar Proyecto'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="bg-sand-300 space-y-4 w-full p-8 pt-4 ">
            <Input
              type="text"
              placeholder="Nombre"
              name="nombre"
              onChange={handleChange}
              value={proyecto.nombre}
              required
            />
            <textarea
              className="flex max-h-20 h-20 w-full resize-none p-2 "
              placeholder="Descripcion"
              name="descripcion"
              onChange={handleChange}
              value={proyecto.descripcion}
            />
            <div className="flex flex-col">
              <text className="text-lg">Puedes agregar participantes al proyecto</text>
              <Select
                multiple
                value={selectedParticipantes}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => (
                      <Chip
                        key={id}
                        label={
                          !isNilorEmpty(formularios) ? formularios.find((e) => e.id_form === id).nombre_form : null
                        }
                      />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {!isNilorEmpty(formularios) &&
                  formularios.map((form: any) => (
                    <MenuItem key={form.id_form} value={form.id_form}>
                      <Checkbox checked={selectedParticipantes.includes(form.id_form)} />
                      <ListItemText primary={form.nombre_form} />
                    </MenuItem>
                  ))}
              </Select>
            </div>
            {errorMessage && (
              <Alert variant="outlined" severity="error">
                {errorMessage + `\n`}
                Error al intentar borrar proyecto. Verifique que no este en uso antes de eliminarlo.
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
              disabled={isNilorEmpty(formularios)}
            >
              {project ? 'Actualizar' : 'Guardar'}
            </Button>
            {project && (
              <Button onClick={() => setOpenDelete(true)} className="normal-case" color="warning">
                Eliminar Proyecto
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle className="bg-gray-900 text-white">Eliminar Proyecto</DialogTitle>
        <div className="bg-gray-900 text-white p-4">
          <text>Estas seguro de que quieres eliminar este proyecto?</text>
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
