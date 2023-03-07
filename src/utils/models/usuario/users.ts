export class Usuario{
    user: usuarioService;
    inmuebles: inmueble[];
    id_establecimiento: string;
}

export class usuarioService{
    _id: string;
    email: string;
    nombres: string;
    apellidos: string;
}

export class inmueble {
    num_inmueble: string;
    estado: string;
}



export class objEditUser {
    assetList: assetList[];
    neighbor: neighbor;
    ureList: ureList[];
    user: user;
}

export class assetList {
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

export class neighbor {
    apellidos: string;
    created_at: string;
    estado: string;
    fecha_nacimiento: string;
    foto: string;
    id_usuario: string;
    identificacion: string;
    nombres: string;
    numero_celular: string;
    sexo: string;
    tipo_doc: string;
    updated_at: string;
    _id: string;
}

export class ureList {
    actualizado_e: string;
    creado_e: string;
    estado: string;
    id_establecimiento: string;
    id_rol: string;
    id_usuario: string;
    num_inmueble: string;
    _id: string;
}

export class user {
    attemps: string;
    created_at: string;
    email: string;
    estado: string;
    nombre: string;
    password: string;
    updated_at: string;
    _id: string;
}





