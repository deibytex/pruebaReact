export interface ClienteDTO{
    clienteIdS:number;
    ClienteId:string|null;
    clienteNombre:string|null;
}

export const InicioCliente : ClienteDTO ={
    clienteIdS:0,
    ClienteId:"",
    clienteNombre:"Todos",
}

export interface TablaDTO{
    assetCodigo:string;
    clienteNombre:string;
    Sitio:string;
    registrationNumber:string;
    AVL:string;
    diffAVL:string;
    nombre:string;
    assetId:string;
    estadoSyscaf:string;
    Cliente:string;
}