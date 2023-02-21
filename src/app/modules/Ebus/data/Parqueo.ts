import { getClientesEBUS, Post_GetUltimaPosicionVehiculos } from "../../../../_start/helpers/Axios/DWHService";

export  function GetClientes() {
    return  getClientesEBUS();
}

export  function GetUltimaPosicionVehiculos(clientesIds:string|undefined,Periodo:string) {
    var params: { [id: string]: string | null | undefined;} = {};
    params['clienteids'] = clientesIds;
    params['Periodo'] = Periodo;
    return  Post_GetUltimaPosicionVehiculos(params);
}

