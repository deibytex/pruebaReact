export interface EventoActivo {
    EventId : number;
    AssetId : number;
    registrationnumber: string;
    description : string;
    DriverId: number;
    name: string;
    descriptionevent : string;
    EventDateTime: Date ;
    Latitud : number;
    Longitud: number;
    evento:string;
}

export interface ClientesFatiga 
{
    ClienteIdS : number; 
    ClienteId : number; 
    clienteNombre : string;
}