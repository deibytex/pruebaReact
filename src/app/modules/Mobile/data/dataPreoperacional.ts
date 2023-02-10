import axios from "axios";
import moment from "moment";
import { DWH_getconsultadinamicasprocedure } from "../../../../apiurlstore";

import { Post_getconsultadinamicas } from "../../../../_start/helpers/Axios/CoreService";

export  function getVehiculosOperando( ClienteIds: string, Fecha : Date) {

    var params: { [id: string]: string | null; } = {};
    params["ClienteIds"] =ClienteIds;
    params["Fecha"] = moment(Fecha).format("YYYYMMDD");
 
    return  axios({
      method: 'post',
      url: DWH_getconsultadinamicasprocedure,
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      params : { Clase: "FATGQueryHelper" , NombreConsulta : "GetVehiculosOperacion" }
    });
  }