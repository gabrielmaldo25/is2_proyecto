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
  descripcion_rol?: string;
  rol_desde?: Date;
  rol_hasta?: Date;
}
