import axios from 'axios'
import { NEP_DownloadFile, NEP_GetDirectory, NEP_UploadFile } from '../../../../apiurlstore';
import { Post_getconsultadinamicas } from '../../../../_start/helpers/Axios/CoreService';
import { AreaDTO } from '../models/ConfigCampoDTO';
import { ArchivoDTO, neptunoDirectory } from '../models/neptunoDirectory';

// descarga la informacion del nodo del tree view
// debe pasarle la ruta tal cual como se encuentra en el blog storgare no es caseSensitive
export async function DescargarArchivo(nombrearchivo: string, container: string) {
    const FileDownload = require('js-file-download');
    await axios({
        method: 'get',
        url: NEP_DownloadFile,
        params: { nombrearchivo, container },
        responseType: 'blob'
    }).then(
        t => {
            const archivo = nombrearchivo?.split("/");
            FileDownload(t.data, archivo[archivo.length - 1]);  
        }
    ).catch((c) =>  {
        
    });
}
// DESCARGA EL DIRECTORIO COMPLETO DEL BLOBSTORAGE
export async function DescargarDirectorio(container: string, filter: string) {
    const response = await axios.get(NEP_GetDirectory, { params: { container, filter } });
    return (response.data as Array<neptunoDirectory>);
}

export async function cargarArchivo(archivo: any, handleshowFileLoad: ((arg0: boolean) => void), srcFileLoad: string, contenedor: string, handlesdatosNeptuno: React.Dispatch<React.SetStateAction<neptunoDirectory[]>>) {

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("src", `${srcFileLoad}`);
    formData.append("nombre", "desde el blob");
    formData.append("contenedor", contenedor);
    await axios({
        method: 'post',
        url: NEP_UploadFile,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(
        t => {            
            handleshowFileLoad(false);
            (async () => {
                handlesdatosNeptuno(await DescargarDirectorio(contenedor, ""));
            })()
            // actualizar la data tree
            // colocar un mensaje de ok
        }
    );
}

// DESCARGA EL DIRECTORIO COMPLETO DEL BLOBSTORAGE
export async function GetInformacionCuenta(container: string) {
    var params: { [id: string]: string | null; } = {};
    params["AreaId"] =null;
    params["container"] = container;
    params["EsActivo"] = "1";
    // hacemos la consulta 
    return  await Post_getconsultadinamicas({    Clase : "NEPQueryHelper",  NombreConsulta: "GetAreaInformacion" }, params);

}


export  function GetArchivosPorCuenta(container: string) {
    var params: { [id: string]: string | null; } = {};
    params["ArchivoId"] =null;
    params["container"] = container;
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    Clase : "NEPQueryHelper",  NombreConsulta: "GetArchivos" }, params);
   
}




