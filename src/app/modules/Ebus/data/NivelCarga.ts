import { getClientesEBUS, getVehiculosCliente, Post_EventActiveViajesByDayAndClient, Post_GetConsultasDinamicas, Post_GetConsultasDinamicasUser, Post_GetConsultasDinamicasUserDWH, Post_GetTiempoActualizacion, Post_SetColumnasDatatable } from "../../../../_start/helpers/Axios/DWHService";

export  function GetClientes() {
    return  getClientesEBUS();
}
export  function GetVehiculos(ClienteIds: string|null) {
    var params: { [id: string]: string | null; } = {};
    params["usuarioids"] = ClienteIds;
    // hacemos la consulta 
    return  getVehiculosCliente(ClienteIds,"Available");
   
}

export function GetClientesEsomos(){
    var params: { [id: string]: string | null; } = {};
    return  Post_GetConsultasDinamicasUserDWH({    Clase : "EbusQueryHelper",  NombreConsulta: "getListClienteAsignados", Pagina :null, RecordsPorPagina :null}, params);
}

export function PostEventActiveViajesByDayAndClient(clientesIds:string, Periodo:string){
    var params: { [id: string]: string | null; } = {};
    params['clienteids'] = clientesIds;
    params['period'] = Periodo;
    params['command'] = 'Viaje';
    return  Post_EventActiveViajesByDayAndClient( params);
}

export function GuardarColumnas(Clave:string, UsuarioIds:string, Columna:string, IdTabla:string, OpcionId:string, ConfiguracionDatatableId:string) {
    let params : { [id: string]: string | null; } = {};
    params['Clave'] = Clave;
    params['UsuarioIds'] = UsuarioIds;
    params['Columna'] = Columna;
    params['IdTabla'] = IdTabla;
    params['OpcionId'] = OpcionId;
    params['ConfiguracionDatatableId'] = ConfiguracionDatatableId;
    return Post_SetColumnasDatatable(params);
}
export function ValidarTiempoActualizacion(ClienteId:string) {
    let params : { [id: string]: string | null; } = {};
    params['ClienteId'] = ClienteId;
    return Post_GetTiempoActualizacion(params);
}
