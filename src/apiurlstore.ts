const apiURL = process.env.REACT_APP_API_URL;
const apiURLDWH = process.env.REACT_APP_API_DWH_URL;
export const urlNeptunoGetDirectory = `${apiURL}/archivos/getDirectorio`
export const urlNeptunoUploadFile = `${apiURL}/archivos/blobservice`
export const urlNeptunoDownloadFile = `${apiURL}/archivos/DownloadFileFromBlob`

/*URL ACCOUNT PARA EDITAR, CREAR */

export const Auth_EditarUsuario = `${apiURL}/account/editar`
export const Auth_ModificarPassword = `${apiURL}/account/RessetPassword`

/* URL PARA FATIGUE */
export const Fatig_GetEventosActivosCliente = `${apiURLDWH}/portal/getconsultasdinamicasproced`