export interface Clientes {
    clienteIdS:number;
    clienteId:string;
    clienteNombre:string;
    clienteIdString:string
}

export interface ListaNotifacion {
    ListaClienteNotifacionId:number;
    ClienteIds:number;
    clienteNombre:string|null;
    NombreLista:string
}

export interface dualList{
    value:string;
    label:string;
}

export interface Sites{
    clienteId: number;
    siteId: string;
    siteName: string;
}

export interface SitesNotifacion{
    ListaClienteNotifacionId: Number;
    SiteId: string;
}