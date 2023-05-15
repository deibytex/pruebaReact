const apiURL = process.env.REACT_APP_API_URL;
const apiURLDWH = process.env.REACT_APP_API_DWH_URL;
const apiURLPORTAL = process.env.REACT_APP_API_MVC_URL;

console.log(apiURL,apiURLDWH, apiURLPORTAL )
/*URL ACCOUNT PARA EDITAR, CREAR */

export const Auth_EditarUsuario = `${apiURL}/account/editar`
export const Auth_ModificarPassword = `${apiURL}/account/RessetPassword`
export const Auth_GetMenuUsuario = `${apiURL}/account/react/GetMenuUsuario`
export const Auth_RefreshToken = `${apiURL}/account/refresh-token`


export const DWH_getconsultadinamicasprocedure = `${apiURLDWH}/portal/getconsultasdinamicasproced`
export const DWH_getconsultadinamicasprocedureparamNulleables = `${apiURLDWH}/portal/GetConsultasDinamicasProcedParamNulleables`

export const DWH_GetConsultasDinamicas = `${apiURLDWH}/portal/GetConsultasDinamicas`
export const DWH_getDynamicValueProcedureDWHTabla = `${apiURLDWH}/portal/GetConsultasDinamicasTablaDinamica`
export const CORE_GetConsultasDinamicas = `${apiURLDWH}/Adm/GetConsultasDinamicas`
export const CORE_getconsultadinamicas = `${apiURL}/Adm/auth/GetConsultasDinamicas`
export const CORE_ExecProcedureByTipoConsulta = `${apiURL}/Adm/auth/ExecProcedureByTipoConsulta`
export const CORE_getconsultadinamicasUser = `${apiURL}/Adm/auth/GetConsultasDinamicasConAutorizacionUser`
export const CORE_getconsultadinamicasUserDWH = `${apiURL}/Adm/auth/GetConsultasDinamicasConAutorizacionUserDWH`



/* URL PARA NEPTUNO */
export const NEP_InsertaArchivo = `${apiURL}/Archivos/SetArchivo`
export const NEP_EditarArchivo = `${apiURL}/Archivos/SetArchivo`

export const NEP_ConsutlaListado = `${apiURL}/Archivos/GetArchivos`
export const NEP_GetDirectory = `${apiURL}/archivos/getDirectorio`
export const NEP_UploadFile = `${apiURL}/archivos/blobservice`
export const NEP_DownloadFile = `${apiURL}/archivos/DownloadFileFromBlob`

/* CLIENTES */

export const CLIENTE_GetClientes = `${apiURLDWH}/Cliente/GetClientes`//[Required] int Estado, long? ClienteId, int? ClienteIds
export const ASSET_GetAssetsEstados = `${apiURLDWH}/Asset/GetAssets/getEstadosAssets` //long? ClienteId,string UsertState
export const ASSET_GetAssetsClienteId = `${apiURLDWH}/Asset/GetAssets/ClienteId` //long? ClienteId,string UsertState
export const ASSET_GetClientesClienteIds = `${apiURLDWH}/Asset/GetAssets/ClienteIds` //int? ClienteIds, string UsertState
export const EBUS_GetClientesUsuarios = `${apiURLDWH}/Ebus/GetClientesUsuarios` //int? ClienteIds, string UsertState
export const EBUS_getEventActiveViajesByDayAndClient = `${apiURLDWH}/Ebus/GetEventosActivosByClienteIds` 
export const EBUS_getEventActiveRecargaByDayAndClient = `${apiURLDWH}/Ebus/GetEventosActivosRecargaByClienteIds` 
export const EBUS_SetColumnasDatatable = `${apiURLDWH}/Ebus/SetColumnasDatatable` 
export const EBUS_GetColumnasDatatable = `${apiURLDWH}/Ebus/GetColumnasDatatable` 
export const EBUS_GetTiempoActualizacion = `${apiURLDWH}/Ebus/GetTiempoActualizacion` 
export const EBUS_GetUltimaPosicionVehiculos = `${apiURLDWH}/Ebus/GetUltimaPosicionVehiculos` 
export const ASSET_getAssets = `${apiURLDWH}/Asset/getAssets`

/* MOVIL */
export const MOVIL_getReportesPorTipo = `${apiURLDWH}/Movil/GetReportePorTipo`
export const EBUS_GetListaClientesActiveEvent = `${apiURLDWH}/Ebus/GetListaClientesActiveEvent` 
export const EBUS_SetClientesActiveEvent = `${apiURLDWH}/Ebus/SetClientesActiveEvent` 
export const EBUS_GetLocations = `${apiURLDWH}/Ebus/GetLocations` 
export const EBUS_GetUsuariosEsomos = `${apiURLDWH}/Ebus/GetUsuariosEsomos` 
export const EBUS_GetListadoClientesUsuario = `${apiURLDWH}/Ebus/GetListadoClientesUsuario` 

/* Drivers */
export const DRIVER_GetDriversClienteId = `${apiURLDWH}/Driver/GetDrivers/ClienteId` //long? ClienteId,string UsertState


/* API PORTAL */
export const PORTAL_getReporteSotramacMS = `${apiURLPORTAL}/Sotramac/DescargarReporte`

/** SOTRAMAC DESCARGA REPORTE */
export const SOTRA_descargaReporte  = `${apiURLDWH}/ExcOperacional/ReporteExcelencia`;

/* TX */
export const TX_GetListaSemana = `${apiURLDWH}/Tx/GetListaSemanaReportesByTipo` 
export const TX_GetUnidadesActivas = `${apiURLDWH}/Tx/GetReporteUnidadesActivas`
export const TX_GetSnapShotTickets = `${apiURLDWH}/Tx/GetSnapShotTickets`
export const TX_GetSnapShotTransmision = `${apiURLDWH}/Tx/GetSnapShotTransmision`

/* BASES */
export const BASES_getDetalleListas = `${apiURLDWH}/Bases/getDetalleListas`
