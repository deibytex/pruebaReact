import { getClientesEBUS, getVehiculosCliente, Post_EventActiveViajesByDayAndClient, Post_GetConsultasDinamicasDWH, Post_GetConsultasDinamicasUserCore, Post_GetConsultasDinamicasUserDWH, Post_getDynamicProcedureDWH, Post_GetTiempoActualizacion, Post_SetColumnasDatatable } from "../../../../_start/helpers/Axios/DWHService";

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
export function GetClientesEsomos1( userid:string){
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

export function GuardarConfiguracion(UserId:string, OpcionId:string, 
    OrganizacionId:string, ClienteId:string, Configuracion:string, FechaSistema:string) {
    let params : { [id: string]: string | null; } = {};
    params['UserId'] = UserId;
    params['OpcionId'] = OpcionId;
    params['OrganizacionId'] = OrganizacionId;
    params['ClienteId'] = ClienteId;
    params['Configuracion'] = Configuracion;
    params['FechaSistema'] = FechaSistema;
    return Post_GetConsultasDinamicasUserCore({    Clase : "PortalQueryHelper",  NombreConsulta: "ConfiguracionGuardar", Pagina :null, RecordsPorPagina :null},params);
}
export function ObtenerConfiguracion(UserId:string, OpcionId:string, 
    OrganizacionId:string, ClienteId:string) {
    let params : { [id: string]: string | null; } = {};
    params['UserId'] = UserId;
    params['OpcionId'] = OpcionId;
    params['OrganizacionId'] = OrganizacionId;
    params['ClienteId'] = ClienteId;
    return Post_GetConsultasDinamicasUserCore({    Clase : "PortalQueryHelper",  NombreConsulta: "ObtenerConfiguracion", Pagina :null, RecordsPorPagina :null},params);
}

