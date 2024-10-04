export interface Circular{

    id : number;
    usuarioId: number;
    regionId: number;
    agenciaId: number;
    nro_solicitud : string;
    respaldo: string;
    caedecId : number;
    objetivo_operacion: string;
    destino_cap_inv_ope: string;
    tipo_empresa: string;
    ctd_empleos_gen: number;
    monto_credito_mn : number;
    monto_credito_me: number;
    ctd_residuos_rec:number;
    emision_gei_evi : number;
    fecha_registro: Date;
    fecha_actualizacion: Date;
}