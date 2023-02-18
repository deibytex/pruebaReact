
import moment from "moment";
import { useEffect, useState } from "react";
import { TituloNivelCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core/PageData";
import { Principal } from "./components/NivelCarga/principal";

import { DataEventosTiempoClientes, Indicador, IndicadorCargado, NivelCargaProvider, useDataNivelCarga  } from "./core/NivelCargaProvider";


type Props = {
};

 const  NivelCarga: React.FC<Props> = () => {
    const [tamaMapa, settamaMapa] = useState("50%");
    const [tamaTabla, settamaTabla] = useState("50%");
    const [VisibleL, setVisibleL]  = useState(true);
    const {Visible, setResetearValores, ResetearValores} = useDataNivelCarga()
    const [Reset, setReset]  = useState(false);
    useEffect(() =>{
        (Reset ? setReset(true):setReset(false));
        setVisibleL((Visible == undefined ? false:Visible));
    },[Reset])
     //Funcion  para la tabla 100% o 50%
     const ExpandirContraerTabla = () =>{
        //Tabla
         if(tamaTabla == '50%')
           settamaTabla("100%");
         else
           settamaTabla("50%");
         //Mapa
         if(tamaMapa == '50%')
             settamaMapa('0%')
         else
             settamaMapa('50%')
     }
     const ResetearDatos = () =>{
        setReset(!Reset);
        setResetearValores(Reset)
     }
    return(
            <NivelCargaProvider>
                <PageTitle >{TituloNivelCarga}</PageTitle>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-xs-6">
                        <button className="btn btn-sm btn-primary" title="Expadir contraer tabla" onClick={ExpandirContraerTabla}><i className="bi-display"></i></button>
                        <button className="btn btn-sm btn-primary" title="Resetear Mapa" onClick={ResetearDatos}><i className="bi-filter"></i></button>
                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-5">
                        <DataEventosTiempoClientes>{moment().format("MYYYY").toString()}</DataEventosTiempoClientes>
                    </div>
                    <div  className="col-sm-1 col-md-1 col-xs-1">
                        <div style={{paddingTop:'5px'}}></div>
                        <Indicador>{VisibleL}</Indicador>
                        <IndicadorCargado>{VisibleL}</IndicadorCargado>
                    </div>
                </div>
                <Principal ExpandirContraerTabla={ExpandirContraerTabla} tamaTabla={tamaTabla} tamaMapa={tamaMapa} ResetearDatos={Reset}  ></Principal>
            </NivelCargaProvider>
    )
}
export {NivelCarga};