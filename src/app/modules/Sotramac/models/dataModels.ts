export interface Listas {
    ListaId : number;
    Nombre : string;
}

export interface DetalleListas {
    DetalleListaId : number;
    ListaId : number;
    Nombre : string;
    Sigla: string;
}

export interface Sites {
    siteid : number;
    sitename : string;
}

export interface AssetsTypes {
    AssetTypeId : number;
    Nombre : string;
}

export interface Assets {
    assetId : number;
    assetIdString: string;
    description : string;
    assetTypeId: number;
}

export interface Drivers {
    DriverId : number;
    DriverIdString: string;
    name : string;
    SiteId: number;
}

export interface dualList{
    value:string;
    label:string;
}

