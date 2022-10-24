import axios from "axios";

import { Fatig_GetEventosActivosCliente } from "../../../../apiurlstore";
import { ParamsEndPointDynamic } from "../../../../_start/helpers/Models/paramsConsultasDinamicas";


export  function getEventosActivosPorDia(props: ParamsEndPointDynamic , body: any) {
    return  axios({
      method: 'post',
      url: Fatig_GetEventosActivosCliente,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }