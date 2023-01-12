const apiURL = process.env.REACT_APP_API_URL;
const apiURLDWH = process.env.REACT_APP_API_DWH_URL;


/*URL ACCOUNT PARA EDITAR, CREAR */

export const Auth_EditarUsuario = `${apiURL}/account/editar`
export const Auth_ModificarPassword = `${apiURL}/account/RessetPassword`
export const Auth_GetMenuUsuario = `${apiURL}/account/react/GetMenuUsuario`
export const Auth_RefreshToken = `${apiURL}/account/refresh-token`


export const DWH_getconsultadinamicasprocedure = `${apiURLDWH}/portal/getconsultasdinamicasproced`
export const DWH_GetConsultasDinamicas = `${apiURLDWH}/portal/GetConsultasDinamicas`
export const CORE_getconsultadinamicas = `${apiURL}/Adm/auth/GetConsultasDinamicas`
export const CORE_ExecProcedureByTipoConsulta = `${apiURL}/Adm/auth/ExecProcedureByTipoConsulta`




/* URL PARA NEPTUNO */
export const NEP_InsertaArchivo = `${apiURL}/Archivos/SetArchivo`
export const NEP_EditarArchivo = `${apiURL}/Archivos/SetArchivo`

export const NEP_ConsutlaListado = `${apiURL}/Archivos/GetArchivos`
export const NEP_GetDirectory = `${apiURL}/archivos/getDirectorio`
export const NEP_UploadFile = `${apiURL}/archivos/blobservice`
export const NEP_DownloadFile = `${apiURL}/archivos/DownloadFileFromBlob`

/* CLIENTES */

export const CLIENTE_GetClientes = `${apiURLDWH}/Cliente/GetClientes`//[Required] int Estado, long? ClienteId, int? ClienteIds

export const ASSET_GetClientesClienteId = `${apiURLDWH}/Asset/GetAssets/ClienteId` //long? ClienteId,string UsertState
export const ASSET_GetClientesClienteIds = `${apiURLDWH}/Asset/GetAssets/ClienteIds` //int? ClienteIds, string UsertState