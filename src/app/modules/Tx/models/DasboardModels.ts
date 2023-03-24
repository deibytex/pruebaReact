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
export interface TablaClientesTxDTO{
    clientenNombre:string;
    DiasSinTx:string;
} 