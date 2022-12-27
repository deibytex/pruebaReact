import axios from "axios";
import { ASSET_GetClientesClienteIds, DWH_GetConsultasDinamicas } from "../../../apiurlstore";
import { ParamsEndPointDynamic } from "../Models/paramsConsultasDinamicas";

export function Post_GetConsultasDinamicas(props: ParamsEndPointDynamic, body: any) {
    return axios({
      method: 'post',
      url: DWH_GetConsultasDinamicas,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params: props
    });
  }
  

  export  function getVehiculosCliente( ClienteIds: string, UsertState : string) {
    return  axios({
      method: 'get',
      url: ASSET_GetClientesClienteIds,     
      headers: { 'Content-Type': 'application/json' },
      params : { ClienteIds, UsertState }
    });
  }