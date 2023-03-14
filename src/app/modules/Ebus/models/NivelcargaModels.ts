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





export interface TablaDTO {
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

