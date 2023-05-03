import { Post_getconsultadinamicasUser } from "../../../../_start/helpers/Axios/CoreService";

export function GetClientesAdministradores(clientesIds :string|null) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['clienteIdS'] = clientesIds; 
       
    return  Post_getconsultadinamicasUser({
        NombreConsulta: "GetClientesAdministradores", Clase: "PortalQueryHelper",
        Pagina: null,
        RecordsPorPagina: null
    }, params);
}
