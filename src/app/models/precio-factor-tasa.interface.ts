export interface PrecioFactorTasa{

    id : number;
    parametro: string;
    fuente: string;
    tipo:string;
    descripcion: string;
    unidad:string;
    valor: number;
    fecha_registro: Date;
    fecha_actualizacion: Date;
}