export class Mensaje{
    fotoPerfil: string;
    nombreUsuario: string;
    numeroInmueble: string;
    mensaje: msg[];
};

export class userChat {
    _id: string;
    _idEstablecimiento: string;
    idUsuarioEnvio: string;
    nombre: string;
    foto: string;
    rol: string;
    msg: string;
    inmueble: string;
    fecha: string;
    estadoMensaje: boolean;
    cheked: boolean;
    categoria: number;
    criticidad: number;
    nombreCategoria: string;
}

export class msg {
    rolUsuario: string;
    mensaje: string;
    fechaMensaje: string;
    idUsuarioEnvio: string;
    nombreUsuario: string;
    idCategoria: number;
    criticidad: number;
    nombreCategoria: string;
    isDelete: boolean;
}

export class datachat {
    fotoPerfil: string;
    nombreUsuario: string;
    numeroInmueble: string;
    idUsuario: string;
}

export class userChatCreate{
        apellidos: string;
        created_at: string;
        estado: string;
        fecha_nacimiento: string;
        foto: string;
        id_establishment: string;
        id_usuario: string;
        identificacion: string;
        nombres: string;
        numero_celular: string;
        sexo: string;
        tipo_doc: string;
        updated_at: string;
        _id: string;
}

export class inmuebleChat{
        coeficiente: string;
        created_at: string;
        cuartosUtiles: string;
        id_establecimiento: string;
        mascotas: string;
        num_inmueble: string;
        numero_fijo: string;
        updated_at: string;
        vehiculos: string;
        _id: string;
}

export class tokenNotify{
    token: string;    
}


