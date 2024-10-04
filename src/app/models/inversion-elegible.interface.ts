export interface InversionElegible{

    id : number;
    nombre: string;
    categoria : string;
    indicador_efi_ener : string;
    linea_base : string;
    criterio_elegible : string;
    img_elegible: Blob;
    subcategoriaId: Number;
    fecha_subida: Date;
    contenidoB64: string;
    
}