import { string } from "yup";

export interface ClienteDTO{
    clienteIdS:number;
    ClienteId:string|null;
    clienteNombre:string|null;
    clienteIdString:string
}

export const InicioCliente : ClienteDTO ={
    clienteIdS:0,
    ClienteId:"",
    clienteNombre:"",
    clienteIdString:""
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
    UsuarioNombre:string;
    Documento:string;
    EsActivo:boolean;
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

export
 interface TablaParametrizacionVariables {
    Usuario:string;
    Cliente:string;
    Valor:string;
    Tipo:string;
    TipoparametroId:number;
    FechaSistema:string;
    EsActivo:boolean;
    ParametrizacionId:number;
    ClienteIds:number;
 }
export interface LocationDualDTO{
    value:string;
    label:string;
}

export interface  TiposParametro {
    Tiempos_Actualizacion : number;
    Soc_MAx : number;
    Pistola_Conectada : number;
    Pistola_Desconectada : number;
  }
  export const TiposParametro : TiposParametro  = {
    Tiempos_Actualizacion : 67,
    Soc_MAx : 71,
    Pistola_Conectada:  72,
    Pistola_Desconectada : 73,
  }