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

export interface Proyecto {
  id_proyecto?: any;
  nombre: string;
  descripcion?: any;
  participantes?: any;
}

export interface UserStory {
  id_us?: any;
  id_sprint?: any;
  nombre: string;
  id_estado: any;
  id_user?: any;
  id_proyecto: any;
  descripcion?: any;
}
