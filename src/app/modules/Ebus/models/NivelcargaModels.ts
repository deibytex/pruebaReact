import { NumberFormat } from "sheetjs-style/types";

export interface AssetsDTO
{
    assetId: string ;
    assetTypeId: string;  
    description: string;
    registrationNumber: string;
    siteId : string;
    clienteId:string;
    userState:string;
}


export interface ClienteDTO{
    clienteIdS:number;
    ClienteId:string|null;
    clienteNombre:string|null;
}

export const InicioCliente : ClienteDTO ={
    clienteIdS:0,
    ClienteId:"",
    clienteNombre:"",
}
export interface dualListDTO{
    value:string;
    label:string;
}

export interface TablaDTO{
    fechaString:string|null;
    placa:string|null;
    driver:string|null;
    socInicial:string|null;
    soc:string|null;
    kms:number|null;
    eficiencia:number|null;
    porRegeneracion:number|null;
    autonomia:number|null;
    energia:number|null;
    energiaDescargada:number|null;
    energiaRegenerada:number|null;
    odometro:number|null;
    velocidadPromedio:number|null;
}

export const InicioTabla : TablaDTO =
{
    fechaString:null,
    placa:null,
    driver:null,
    socInicial:null,
    soc:null,
    kms:null,
    eficiencia:null,
    porRegeneracion:null,
    autonomia:null,
    energia:null,
    energiaDescargada:null,
    energiaRegenerada:null,
    odometro:null,
    velocidadPromedio:null
}

export interface MapaDTO {
    altitud:number;
    assetId:string;
    autonomia:number;
    driver:string;
    eficiencia:number;
    energia:number;
    energiaDescargada:number;
    energiaRegenerada:number;
    eventTypeId:number;
    fecha:string;
    fechaSistema:string;
    fechaString:string;
    kms:number;
    latitud:string;
    localizacion:string;
    longitud:string
    odometro:number;
    placa:string;
    porRegeneracion:number;
    soc:number;
    socInicial:number;
    velocidadPromedio:number;
}

export const MapaInicial  : MapaDTO = {
    altitud:0,
    assetId:"",
    autonomia:0,
    driver:"",
    eficiencia:0,
    energia:0,
    energiaDescargada:0,
    energiaRegenerada:0,
    eventTypeId:0,
    fecha:"",
    fechaSistema:"",
    fechaString:"",
    kms:0,
    latitud:"4.678825",
    localizacion:"",
    longitud:"-74.092691",
    odometro:0,
    placa:"",
    porRegeneracion:0,
    soc:0,
    socInicial:0,
    velocidadPromedio:0
}