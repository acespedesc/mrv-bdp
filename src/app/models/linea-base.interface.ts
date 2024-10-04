export interface LineaBase{

    id : number;
    proyecto : string;
    tipo_linea_base : string;
    tecnologia: string;
    tipo_tecnologia: string;
    unidad_medida: string;
    medida : number;
    fecha_registro: Date;
    fecha_actualizacion: Date;
}