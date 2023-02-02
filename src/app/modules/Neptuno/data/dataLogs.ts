import axios from "axios";
import { Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";


export async function ConsultarUsuarios(Container: string) {
    var params: { [id: string]: string | null; } = {};
    params["Container"] = Container;
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    Clase : "NEPQueryHelper",  NombreConsulta: "GetUsuariosNeptuno", Pagina :null, RecordsPorPagina :null}, params);
};
export async function ConsultarIndicadores(UsuarioId: string | null, FechaInicial: string, FechaFinal: string) {
    var params: { [id: string]: string | null; } = {};
    params["UsuarioId"] = UsuarioId;
    params["FechaInicial"] = FechaInicial;
    params["FechaFinal"] = FechaFinal;
    // hacemos la consulta 
    return  Post_getconsultadinamicas({    Clase : "NEPQueryHelper",  NombreConsulta: "GetIndicadoresLog", Pagina :null, RecordsPorPagina :null}, params);
};

export async function ConsultarLogs(FechaInicial: string|undefined, FechaFinal :string|undefined, UsuarioId:  string) {
    var params: { [id: string]: string | undefined; } = {};
    params["FechaInicial"] =FechaInicial;
    params["FechaFinal"] =FechaFinal;
    params["UsuarioId"] =UsuarioId;

    // hacemos la consulta 
    return  Post_getconsultadinamicas({    Clase : "NEPQueryHelper",  NombreConsulta: "GetLogsPorFechayUsuarios", Pagina :null, RecordsPorPagina :null}, params);
};