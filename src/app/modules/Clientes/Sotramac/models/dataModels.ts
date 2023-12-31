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

export interface ReporteSotramac {
    Posicion : number;
    Cedula: string;
    Vehiculo : string;
    Nombre: string;
    DistanciaRecorridaAcumulada: number;
    ConsumodeCombustibleAcumulado: number;
    DistanciaRecorridaUltimoDia: number;
    RendimientoCumbustibleAcumulado: number;
    UsoDelFreno: number;
    PorDeInercia: number;
    PorDeRalenti: number;
    Co2Equivalente: number;
    GalEquivalente: number;
    ConsumokWh: number;
    COmgkWh: number;
    NOxmgkWh: number;
    PMMasamgkWh: number;
    TipoOperacion: string;
    VelPromedio: number;
}


export interface ParamsReporte {

    FechaInicial : string;
     FechaFinal : string;
     DriversIdS?: string ;
      assetsIds?: string;
       assetTypeId: string;
       SiteId : string | null;
}