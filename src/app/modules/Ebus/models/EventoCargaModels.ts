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
    fecha: string,
    fechaString: string,
    totalTime: string,
    eventTypeId: number,
    consecutivo: string,
    carga: string,
    assetId: string,
    driverId: string,
    soc: number,
    socInicial: number,
    corriente: number,
    voltaje: number,
    potencia: number,
    energia: number,
    eta: string,
    odometer: number,
    velocidadPromedio: number,
    placa: string,
    isDisconected: number,
    potenciaProm: number,
    ubicacion:string
}