
import moment from "moment";
import { useEffect, useState } from "react";
import { TituloNivelCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core/PageData";
import { Principal } from "./components/NivelCarga/principal";

import { DataEventosTiempoClientes, Indicador, IndicadorCargado, NivelCargaProvider, useDataNivelCarga  } from "./core/NivelCargaProvider";


type Props = {
};

 const  NivelCarga: React.FC<Props> = () => {
    //Para los use state
    const [tamaMapa, settamaMapa] = useState("47%");
    const [tamaTabla, settamaTabla] = useState("47%");
    const [VisibleL, setVisibleL]  = useState(true);
    const {Visible, setResetearValores, ResetearValores} = useDataNivelCarga()
    const [Reset, setReset]  = useState(false);
    //el  useEffect
    useEffect(() =>{
        (Reset ? setReset(true):setReset(false));
        setVisibleL((Visible == undefined ? false:Visible));
    },[Reset])
     //Funcion  para la tabla expandir, contraer al  100% o 50%
     const ExpandirContraerTabla = () =>{
        //Tabla
         if(tamaTabla == '47%')
           settamaTabla("100%");
         else
           settamaTabla("47%");
         //Mapa
         if(tamaMapa == '47%')
             settamaMapa('0%')
         else
             settamaMapa('47%')
     }
     //funcion para resetear los datos o devolverlos al normal
     const ResetearDatos = () =>{
        setReset(!Reset);
        setResetearValores(Reset)
     }
     //se retorna la pagina o los botones para expandir/contraer la tabla y resetear datos
    return(
            <NivelCargaProvider>
                <PageTitle >{TituloNivelCarga}</PageTitle>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-xs-6">
                        <button className="btn btn-sm btn-primary" title="Expadir contraer tabla" onClick={ExpandirContraerTabla}><i className="bi-display"></i></button>
                        <button className="btn btn-sm btn-primary" title="Resetear Mapa" onClick={ResetearDatos}><i className="bi-filter"><span aria-hidden="true">&times;</span></i></button>
                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-5">
                        <div style={{float:'right'}}>
                            <DataEventosTiempoClientes>{moment().format("MYYYY").toString()}</DataEventosTiempoClientes>
                        </div>
                    </div>
                    <div  className="col-sm-1 col-md-1 col-xs-1">
                        <div style={{float:'right'}}>
                            <div style={{paddingTop:'6px'}}></div>
                            <Indicador>{VisibleL}</Indicador>
                            <IndicadorCargado>{VisibleL}</IndicadorCargado>
                        </div>
                    </div>
                </div>
                <Principal ExpandirContraerTabla={ExpandirContraerTabla} tamaTabla={tamaTabla} tamaMapa={tamaMapa} ResetearDatos={Reset}></Principal>
            </NivelCargaProvider>
    )
}
export {NivelCarga};