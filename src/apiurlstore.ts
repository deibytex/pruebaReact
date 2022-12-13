const apiURL = process.env.REACT_APP_API_URL;
const apiURLDWH = process.env.REACT_APP_API_DWH_URL;


/*URL ACCOUNT PARA EDITAR, CREAR */

export const Auth_EditarUsuario = `${apiURL}/account/editar`
export const Auth_ModificarPassword = `${apiURL}/account/RessetPassword`
export const Auth_GetMenuUsuario = `${apiURL}/account/GetMenuUsuario`


export const DWH_getconsultadinamicasprocedure = `${apiURLDWH}/portal/getconsultasdinamicasproced`
export const CORE_getconsultadinamicas = `${apiURL}/Adm/GetConsultasDinamicas`
export const CORE_ExecProcedureByTipoConsulta = `${apiURL}/Adm/ExecProcedureByTipoConsulta`




/* URL PARA NEPTUNO */
export const NEP_InsertaArchivo = `${apiURL}/Archivos/SetArchivo`
export const NEP_EditarArchivo = `${apiURL}/Archivos/SetArchivo`

export const NEP_ConsutlaListado = `${apiURL}/Archivos/GetArchivos`
export const NEP_GetDirectory = `${apiURL}/archivos/getDirectorio`
export const NEP_UploadFile = `${apiURL}/archivos/blobservice`
export const NEP_DownloadFile = `${apiURL}/archivos/DownloadFileFromBlob`