import axios from 'axios'
import { CORE_getconsultadinamicasUser, NEP_DownloadFile, NEP_DownloadFileBase64, NEP_GetDirectory, NEP_InsertaArchivo, NEP_UploadFile } from '../../../../apiurlstore';
import { Post_ExecProcedureByTipoConsulta, Post_getconsultadinamicasUser, Post_getconsultadinamicas } from '../../../../_start/helpers/Axios/CoreService';
import confirmarDialog, { errorDialog, successDialog } from '../../../../_start/helpers/components/ConfirmDialog';
import {  neptunoDirectory } from '../models/neptunoDirectory';
import { FechaMomentUtc, FechaServidor, FechaServidorString } from '../../../../_start/helpers/Helper';

// descarga la informacion del nodo del tree view
// debe pasarle la ruta tal cual como se encuentra en el blog storgare no es caseSensitive
export async function DescargarArchivo(nombrearchivo: string, container: string, nombreDescarga : string) {
    const FileDownload = require('js-file-download');
    await axios({
        method: 'get',
        url: NEP_DownloadFile,
        params: { nombrearchivo, container },
        responseType: 'blob'
    }).then(
        t => {    
            nombreDescarga =   (nombreDescarga.length > 0) ? nombreDescarga : nombrearchivo;               
            FileDownload(t.data, nombreDescarga);  
        }
    ).catch((c) =>  {
        
    });
}
export async function DescargarFile(nombrearchivo: string, container: string) {
    return axios({
        method: 'get',
        url: NEP_DownloadFile,
        params: { nombrearchivo, container }
       
    })
   
}
export async function DescargarFileBase64(nombrearchivo: string, container: string) {
    return axios({
        method: 'get',
        url: NEP_DownloadFileBase64,
        params: { nombrearchivo, container }
       
    })
   
}



// DESCARGA EL DIRECTORIO COMPLETO DEL BLOBSTORAGE
export async function DescargarDirectorio(contenedor: string, Nombre: string) {
    const response = await axios.get(NEP_GetDirectory, { params: { contenedor, Nombre } });
    return (response.data.data as Array<neptunoDirectory>);
}

export async function cargarArchivo(archivo: any, 
    handleshowFileLoad: ((arg0: boolean) => void), 
    srcFileLoad: string, contenedor: string, 
    handlesdatosNeptuno: React.Dispatch<React.SetStateAction<neptunoDirectory[]>>, 
    usuario: string, Extension:string,    
    Tipo: string,
    Peso : string) {
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("src", `${srcFileLoad}`);
   
    formData.append('NombreArchivo', `${srcFileLoad}`);
    formData.append('Descripcion', 'Contenedor Servicio Tecnico');
    formData.append('DatosAdicionales', '');
    formData.append('UsuarioId', usuario);
    formData.append('AreaId','3');
    formData.append('Tipo', `${Tipo}`);
    formData.append('Peso', Peso);
    formData.append('Orden', "0");
    formData.append('Extension', Extension);
    formData.append('MovimientoId', "1");
    formData.append('DescripcionLog', 'Creación del documento');
         
    axios({
      method: 'post',
      url: NEP_InsertaArchivo,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { contenedor }
    }).then(
      t => {
   
        (async () => {
            handleshowFileLoad(false)
            handlesdatosNeptuno(await DescargarDirectorio(contenedor, ""));
        })()
        successDialog("Datos guardados exitosamente!", "");
      }
    ).catch((e) => {
      errorDialog(e, "<i>Favor comunicarse con su administrador.</i>");

    });
 
}

// DESCARGA EL DIRECTORIO COMPLETO DEL BLOBSTORAGE
export async function GetInformacionCuenta(container: string) {
    var params: { [id: string]: string | null; } = {};
    params["AreaId"] =null;
    params["container"] = container;
    params["EsActivo"] = "1";
    // hacemos la consulta 
    return  await Post_getconsultadinamicas({    Clase : "NEPQueryHelper",  NombreConsulta: "GetAreaInformacion", Pagina :null, RecordsPorPagina :null}, params);

}


export  function GetArchivosPorCuenta(container: string,Pagina: number, RecordsPorPagina: number) {
    var params: { [id: string]: string | null; } = {};
    params["ArchivoId"] =null;
    params["container"] = container;
    params["EsActivo"] = null;
 
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    Clase : "NEPQueryHelper",  NombreConsulta: "GetArchivos", Pagina , RecordsPorPagina }, params);
   
}

export  function UpdateEstadoArchivo(ArchivoId: string, UsuarioId: string, AreaId: number) {
    var params: { [id: string]: string | null; } = {};
    params["ArchivoId"] =ArchivoId;
    params["UsuarioId"] =UsuarioId;
    params["AreaId"] =`${AreaId}`;
    params["FechaSistema"] =FechaMomentUtc.format("YYYY-MM-DD HH:mm:ss");
    // hacemos la consulta 
    return  Post_ExecProcedureByTipoConsulta({    Clase : "NEPQueryHelper",  NombreConsulta: "UpdateEstadoArchivo", Pagina :null, RecordsPorPagina :null}, params);
   
}


export  function ListarArchivosEstado(ArchivoId: string|null, Container:string) {
    var params: { [id: string]: string | null; } = {};
    params["ArchivoId"] =ArchivoId;
    params["Container"] =Container;
    // hacemos la consulta 
    return  Post_getconsultadinamicasUser({
        Clase: "NEPQueryHelper", NombreConsulta: "GetArchivosPorUser",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
   
}




