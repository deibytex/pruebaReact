import axios from 'axios'
import { urlNeptunoDownloadFile, urlNeptunoGetDirectory, urlNeptunoUploadFile } from '../../../../apiurlstore';
import { neptunoDirectory } from '../models/neptunoDirectory';

// descarga la informacion del nodo del tree view
// debe pasarle la ruta tal cual como se encuentra en el blog storgare no es caseSensitive
export async function DescargarArchivo(nombrearchivo: string, container: string) {
    const FileDownload = require('js-file-download');
    await axios({
        method: 'get',
        url: urlNeptunoDownloadFile,
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
export async function DescargarDirectorio(container: string, filter: string) {
    const response = await axios.get(urlNeptunoGetDirectory, { params: { container, filter } });
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
        url: urlNeptunoUploadFile,
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
