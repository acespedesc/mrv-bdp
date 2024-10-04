export interface Ecoeficiencia{

    id : number;
    usuarioId: number;
    regionId: number;
    agencia: number;
    nro_solicitud : string;
    respaldo: string;
    nivel_medida : number;
    tipo_tecnologia : string;
    monto_inv_mn : number;
    monto_inv_me : number;
    ahorro_energia_anual: number;
    reduccion_emisiones_anual : number;
    fecha_registro: Date;
    fecha_actualizacion: Date;
}