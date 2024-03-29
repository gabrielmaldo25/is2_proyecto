import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  DialogContentText,
  Select,
  MenuItem,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';
import { Usuario } from 'src/interfaces/interfaces';
import * as bcrypt from 'bcryptjs';
import { isNilorEmpty } from 'src/helpers';
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
  name: '',
  email: '',
  password: '',
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
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const passwordRef = useRef(user?.password || null);
  const [openDelete, setOpenDelete] = useState(false);
  const [roles, setRoles] = useState<any>([]);
  const [selectedRol, setSelectedRol] = React.useState<any>({ id: null, valido_hasta: null });

  useEffect(() => {
    if (user && user.rol.id_rol) {
      setSelectedRol({ id: user.rol.id_rol, valido_hasta: user.rol.valido_hasta });
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/roles')
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    user !== null ? setUsuario({ ...user, password: '' }) : null;
  }, [user]);
  const handleClose = () => {
    user ? setUser(null) : null;
    setOpen(false);
  };
  const createUser = async (usuario: Usuario, rol?: any) => {
    const { password, ...restOfUser } = usuario;
    const encrypted = await bcrypt.hash(password, 5);

    await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      body: JSON.stringify({ password: encrypted, rol, ...restOfUser }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  const updateUser = async (id: any, usuario: Usuario, rol?: any) => {
    const { password, ...restOfUser } = usuario;
    let encrypted = '';
    if (!isNilorEmpty(usuario.password)) {
      encrypted = await bcrypt.hash(password, 5);
    }
    await fetch('http://localhost:3000/api/usuarios/' + id, {
      method: 'PUT',
      body: JSON.stringify({ password: encrypted, new_rol: rol, ...restOfUser }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  const handleDelete = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/' + user.id_user, {
        method: 'DELETE',
        body: JSON.stringify(usuario.rol),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      refetchUsers();
      setOpenDelete(false);
      setOpen(false);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChange = ({ target: { name, value } }: ChangeInputHandler) => setUsuario({ ...usuario, [name]: value });

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;

    setSelectedRol({ ...selectedRol, id: value });
  };

  function compararPasswords(pass1: string, pass2: string) {
    return pass1 === pass2;
  }

  function afterSaved() {
    setUsuario(inititalState);
    setPasswordConfirmation('');
    refetchUsers();
    setOpen(false);
  }
  useEffect(() => {}, [selectedRol]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user?.hasOwnProperty('id_user')) {
        if (!isNilorEmpty(usuario.password))
          if (compararPasswords(usuario.password, passwordConfirmation)) {
            updateUser(user.id_user, usuario, selectedRol);
            afterSaved();
          } else alert('Contraseñas deben coincidir');
        else {
          updateUser(user.id_user, usuario, selectedRol);
          afterSaved();
        }
      } else {
        if (compararPasswords(usuario.password, passwordConfirmation)) {
          createUser(usuario, selectedRol);
          afterSaved();
        } else {
          alert('Contraseñas deben coincidir');
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="bg-gray-900 text-white">Agregar Usuario</DialogTitle>
        <form onSubmit={handleSubmit}>
          <div className="bg-sand-300 space-y-4 w-full p-8 pt-4 ">
            <Input type="text" placeholder="Nombre" name="name" onChange={handleChange} value={usuario.name} required />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={usuario.email}
              required
            />
            <Input
              type="password"
              placeholder={user ? 'Nueva Contraseña' : 'Contraseña'}
              name="password"
              onChange={handleChange}
              required={user?.id_user ? false : true}
            />
            <Input
              type="password"
              placeholder={user ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña'}
              name="passwordConfirmation"
              required={user?.id_user ? false : true}
              onChange={({ target: { value } }: ChangeInputHandler) => setPasswordConfirmation(value)}
              value={passwordConfirmation}
            />
            <div className="flex flex-col">
              <text className="text-lg">Puedes seleccionar un rol para este usuario</text>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedRol.id}
                size="small"
                onChange={handleSelectChange}
              >
                <MenuItem value={''}>
                  <ListItemText primary={'Ninguno'} />
                </MenuItem>
                {!isNilorEmpty(roles) &&
                  roles.map((rol: any) => (
                    <MenuItem key={rol.id_rol} value={rol.id_rol}>
                      <ListItemText primary={rol.nombre} />
                    </MenuItem>
                  ))}
              </Select>
              {!isNilorEmpty(selectedRol.id) && (
                <>
                  <text className="text-lg bg-transparent">Rol válido hasta </text>
                  <input
                    onChange={(e: any) => setSelectedRol({ ...selectedRol, valido_hasta: e.target.value })}
                    type="date"
                    className="bg-transparent ring-1 p-2 rounded-sm ring-gray-500"
                  />
                </>
              )}
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
            >
              {user ? 'Actualizar' : 'Guardar'}
            </Button>
            {user && (
              <Button onClick={() => setOpenDelete(true)} className="normal-case" color="warning">
                Eliminar Usuario
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle className="bg-gray-900 text-white">Eliminar Usuario</DialogTitle>
        <div className="bg-gray-900 text-white p-4">
          <text>Estas seguro de que quieres eliminar este usuario?</text>
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
