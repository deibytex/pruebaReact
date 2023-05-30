import { GetConfiguracionAlerta } from "../../../../_start/helpers/Axios/CoreService";

export function  getConfiguraciones (data:any) {
    var params: { [id: string]: string | null; } = {};
    params['nombre'] = data.nombre;
    params['clienteId'] = data.clienteId;
    params['esActivo'] = data.esActivo;
    return  GetConfiguracionAlerta(params);
}

  