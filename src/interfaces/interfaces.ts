export interface Task {
  id?: string;
  title: string;
  description: string;
  created_on?: string;
}

export interface Usuario {
  id_user?: any;
  name: string;
  email: string;
  password: string;
  rol?: any;
}

export interface Permiso {
  id_permiso?: any;
  descripcion: string;
  formularios?: any;
}

export interface Rol {
  id_rol?: any;
  nombre: string;
  permisos?: any;
}
