import axios from "axios";
import { Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";
import { PerfilDTO } from "../models/PerfilModel";
export async function ModificarPerfil(Data: PerfilDTO) {
    var params: { [id: string]: string | null; } = {};
    params["Imagen"] = Data.Imagen;
    params["Nombres"] = Data.Nombre;
    params["Telefono"] = Data.Telefono;
    // hacemos la consulta 
    return  Post_getconsultadinamicasUser({    Clase : "NEPQueryHelper",  NombreConsulta: "SetPerfilUsersById", Pagina :null, RecordsPorPagina :null}, params);
};

export async function GetDataUser() {
    var params: { [id: string]: string | null; } = {};
    // hacemos la consulta 
    return  Post_getconsultadinamicasUser({    Clase : "PortalQueryHelper",  NombreConsulta: "getDataUsers", Pagina :null, RecordsPorPagina :null}, params);
}