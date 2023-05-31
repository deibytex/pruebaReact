import { GetConfiguracionAlerta, SetConfiguracionAlerta } from "../../../../_start/helpers/Axios/CoreService";
export function  getConfiguraciones (data:any) {
    var params: { [id: string]: string | null; } = {};
    params['nombre'] = data.nombre;
    params['clienteId'] = data.clienteId;
    params['esActivo'] = data.esActivo;
    return  GetConfiguracionAlerta(params);
}
export function  setConfiguraciones (data:any) {
    var params: { [id: string]: string | null; } = {};
    params['clave'] = data.clave;
    params['nombre'] = data.nombre;
    params['tiempo'] = data.tiempo;
    params['condicion'] = data.condicion;
    params['columna'] = data.columna;
    params['clienteId'] = data.clienteId;
    params['esActivo'] = data.esActivo;
    params['configuracionAlertaId'] = data.configuracionAlertaId;
    return  SetConfiguracionAlerta(params);
}

  