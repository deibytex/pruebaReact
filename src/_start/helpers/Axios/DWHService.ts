import axios from "axios";
import { ASSET_GetClientesClienteIds, CORE_getconsultadinamicasUser, CORE_getconsultadinamicasUserDWH, DWH_GetConsultasDinamicas, EBUS_GetClientesUsuarios, EBUS_getEventActiveViajesByDayAndClient } from "../../../apiurlstore";
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
  
  export function Post_GetConsultasDinamicasUser(props: ParamsEndPointDynamic, body: any) {
    return axios({
      method: 'post',
      url: CORE_getconsultadinamicasUser,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params: props
    });
  }
  
  export function Post_GetConsultasDinamicasUserDWH(props: ParamsEndPointDynamic, body: any) {
    return axios({
      method: 'post',
      url: CORE_getconsultadinamicasUserDWH,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params: props
    });
  }
  
  
  

  export  function getVehiculosCliente( ClienteIds: string|null, UsertState : string) {
    return  axios({
      method: 'get',
      url: ASSET_GetClientesClienteIds,     
      headers: { 'Content-Type': 'application/json' },
      params : { ClienteIds, UsertState }
    });
  }

    

  export  function getClientesEBUS() {
    return  axios({
      method: 'get',
      url: EBUS_GetClientesUsuarios,     
      headers: { 'Content-Type': 'application/json' },
      params : { }
    });
  }

  export  function Post_EventActiveViajesByDayAndClient(props:any) {
    return  axios({
      method: 'post',
      url: EBUS_getEventActiveViajesByDayAndClient,     
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }

  