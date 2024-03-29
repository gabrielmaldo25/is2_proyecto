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
  abierto?: any;
}

export interface UserStory {
  id_us?: any;
  id_sprint?: any;
  nombre: string;
  id_estado: any;
  id_user?: any;
  id_proyecto: any;
  descripcion?: any;
  usuario?: any;
  estado: any;
}

export interface Sprint {
  id_sprint?: any;
  nombre: any;
  fecha_inicio: any;
  fecha_fin: any;
  id_estado: any;
  id_backlog: any;
  estado: any;
}
