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
    FechaString:string|null;
    Placa:string|null;
    Driver:string|null;
    SocInicial:string|null;
    Soc:string|null;
    Kms:number|null;
    Eficiencia:number|null;
    PorRegeneracion:number|null;
    Autonomia:number|null;
    Energia:number|null;
    EnergiaDescargada:number|null;
    EnergiaRegenerada:number|null;
    Odometro:number|null;
    VelocidadPromedio:number|null;
}

export const InicioTabla : TablaDTO =
{
    FechaString:null,
    Placa:null,
    Driver:null,
    SocInicial:null,
    Soc:null,
    Kms:null,
    Eficiencia:null,
    PorRegeneracion:null,
    Autonomia:null,
    Energia:null,
    EnergiaDescargada:null,
    EnergiaRegenerada:null,
    Odometro:null,
    VelocidadPromedio:null
}

export interface MapaDTO {
    Altitud:number;
    AssetId:string;
    Autonomia:number;
    Driver:string;
    Eficiencia:number;
    Energia:number;
    EnergiaDescargada:number;
    EnergiaRegenerada:number;
    EventTypeId:number;
    Fecha:string;
    FechaSistema:string;
    FechaString:string;
    Kms:number;
    Latitud:string;
    Localizacion:string;
    Longitud:string
    Odometro:number;
    Placa:string;
    PorRegeneracion:number;
    Soc:number;
    SocInicial:number;
    VelocidadPromedio:number;
}

export const MapaInicial  : MapaDTO = {
    Altitud:0,
    AssetId:"",
    Autonomia:0,
    Driver:"",
    Eficiencia:0,
    Energia:0,
    EnergiaDescargada:0,
    EnergiaRegenerada:0,
    EventTypeId:0,
    Fecha:"",
    FechaSistema:"",
    FechaString:"",
    Kms:0,
    Latitud:"",
    Localizacion:"",
    Longitud:"",
    Odometro:0,
    Placa:"",
    PorRegeneracion:0,
    Soc:0,
    SocInicial:0,
    VelocidadPromedio:0
}