import axios from "axios";

import { DWH_getconsultadinamicasprocedure } from "../../../../apiurlstore";
import { ParamsEndPointDynamic } from "../../../../_start/helpers/Models/paramsConsultasDinamicas";


export  function getEventosActivosPorDia(props: ParamsEndPointDynamic , body: any) {
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      params : props
    });
  }