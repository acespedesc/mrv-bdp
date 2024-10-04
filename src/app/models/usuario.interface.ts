export interface Usuario{

    id : number;
    nombre : string;
    apellido_paterno: string;
    apellido_materno: string;
    nro_documento: string;
    usuario: string;
    correo : string;
    contraseña : string;
    fecha_registro: Date;
    fecha_actualizacion: Date;
}