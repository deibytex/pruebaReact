import { Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";
import { GetClientes } from "../../../../_start/helpers/Axios/DWHService";

export function getListadoCLientes() {
    var params: { [id: string]: string | null; } = {};
    params['Estado'] = "1";
    return GetClientes(params);
}

export function getListaClienteNotifacion() {
    var params: { [id: string]: string | null; } = {};
    params["EsActivo"] = "1";

    // hacemos la consulta 
    return Post_getconsultadinamicas({
        Clase: "PortalQueryHelper",
        NombreConsulta: "getListaClienteNotifacion",
        Pagina: null,
        RecordsPorPagina: null
    },
        params);
};