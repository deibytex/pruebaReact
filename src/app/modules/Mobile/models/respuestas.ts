export interface Preoperacional {
    UsuarioID : string;
    ClienteId : number;
    Usuario: string;
    DriverId: number;
    Conductor: string;
    clienteNombre: string;
    FechaHora : Date;
    FechaHoraString: string ;
    AssetId: number;
    Description : string;
    Estado: number;
    EncabezadoId: number;
    PlantillaId: number;
    Gestor: string;
    GetorNombre: string;
    Observaciones: string;
    EsNotificado: boolean;
    EsGestionado: boolean;
}

export interface sinPreoperacional 
{
    AssetId : number; 
    Vehiculo : string; 
    DriverId : number;
    RegistrationNumber : string;
    Conductor : string;
    FechaViaje : Date;
    DistanciaRecorrida : number;
    CantViajes : number;
}

export interface children 
{
    clienteid? : string; 
    clienteIdS : string;
    fecha : string;
    userId: string;
}

export interface Respuestas {
    Pregunta : string;
    Respuesta : string;
    RespuestaId: number;
    UsuarioID: string;
    ClienteId: string;
    Usuario: string;
    clienteNombre : string;
    FechaSistema: Date ;
    Fecha: Date;
    Secuencia : number;
    EncabezadoId: number;
    PreguntaId: number;
    PlantillaId: number;
}

export interface observaciones 
{
    fecha : string; 
    value : string;
    notificar : string;
    EsCerrado?: boolean
}
