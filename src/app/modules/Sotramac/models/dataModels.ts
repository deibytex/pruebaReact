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
    description : string;
    assetTypeId: number;
}

export interface dualList{
    value:number;
    label:string;
}

