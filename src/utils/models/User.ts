export class Credentials{
    username: string;
    password: string;
}

export class loginResponse{
user: User;
token: string;
}

export class User{
    created_at: string;
    email: string;
    estado: string;
    id_rol: string;
    nombre: string;
    password: string;
    updated_at: string;
    _id: string;
    foto: string;
}

export class Permissions{
    creacion: string;
    eliminacion: string;
    estado: string;
    lectura: string;
    modificacion: string;
    _id: string;
    id_opcion: string;
    id_rol: string;
}