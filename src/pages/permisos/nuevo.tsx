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
} from '@mui/material';
import { Permiso } from 'src/interfaces/interfaces';
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
  descripcion: '',
  forms: [],
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
  const [selectedForms, setSelectedForms] = React.useState<any[]>([]);
  const [formularios, setFormularios] = useState([]);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  useEffect(() => {
    if (permission) {
      setSelectedForms(permission.formularios.map((i: any) => i.id_form));
    }
  }, [permission]);
  useEffect(() => {
    setLoading(true);
    fetch('/api/extra/formularios')
      .then((res) => res.json())
      .then((data) => {
        setFormularios(data);
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;

    setSelectedForms(value);
  };

  useEffect(() => {
    permission !== null ? setPermiso({ ...permission }) : null;
  }, [permission]);

  const handleClose = () => {
    permission ? setPermission(null) : null;
    setOpen(false);
  };

  const createPermiso = async (permiso: Permiso) => {
    let payload = { descripcion: permiso.descripcion, forms: selectedForms };
    await fetch('http://localhost:3000/api/permisos', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  const updatePermiso = async (id: any, permiso: Permiso) => {
    let payload = { descripcion: permiso.descripcion, forms: selectedForms };

    await fetch('http://localhost:3000/api/permisos/' + id, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const handleDelete = async () => {
    try {
      const res = await fetchJson('api/permisos/' + permission.id_permiso, {
        method: 'DELETE',
      });
      refetchPermissions();
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

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) => setPermiso({ ...permiso, [name]: value });

  function afterSaved() {
    setPermiso(inititalState);
    setPermission(null);
    setOpen(false);
    refetchPermissions();
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (permission?.hasOwnProperty('id_permiso')) {
        updatePermiso(permission.id_permiso, permiso);
      } else {
        createPermiso(permiso);
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
          {permission ? 'Editar Permiso' : ' Agregar Permiso'}
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
            <div className="flex flex-col">
              <text className="text-lg">Selecciona la/s pantalla/s sobre la que el permiso puede operar</text>
              <Select
                multiple
                value={selectedForms}
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
                      <Checkbox checked={selectedForms.includes(form.id_form)} />
                      <ListItemText primary={form.nombre_form} />
                    </MenuItem>
                  ))}
              </Select>
            </div>
            {errorMessage && (
              <Alert variant="outlined" severity="error">
                {errorMessage + `\n`}
                Error al intentar borrar permiso. Verifique que no este en uso antes de eliminarlo.
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
              {permission ? 'Actualizar' : 'Guardar'}
            </Button>
            {permission && (
              <Button onClick={() => setOpenDelete(true)} className="normal-case" color="warning">
                Eliminar Permiso
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle className="bg-gray-900 text-white">Eliminar Permiso</DialogTitle>
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
