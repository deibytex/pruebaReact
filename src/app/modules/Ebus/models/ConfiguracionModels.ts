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

export interface TablaDTO{
    cliente:string;
    valor:string;
    tipo:string;
    fechaSistema:string;
    esActivo:boolean;
    parametrizacionId:number;
}
export interface TablaUsuariosDTO{
    usuario:string;
    fechaSistema:string;
    esActivo:boolean;
    clienteUsuarioId:number;
}
export interface TablaClienteDTO{
    usuarioNombre:string;
    documento:string;
    esActivo:boolean;
    usuarioIds:number;
    usuarioId:string|null|undefined;
}
export interface TablaClienteEventoActivo{
    clienteNombre:string;
    nit:string;
    telefono:string;
    fechaIngreso:string;
    clienteIdS:number;
    clienteId:string|null|undefined;
}