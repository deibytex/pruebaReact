import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { TituloNivelCarga } from "../../../_start/helpers/Texts/textosPorDefecto";
import { PageTitle } from "../../../_start/layout/core/PageData";
import { Principal } from "./components/NivelCarga/principal";
import { BotonesFiltros, DataEventosTiempoClientes, Indicador, IndicadorCargado, NivelCargaProvider, useDataNivelCarga } from "./core/NivelCargaProvider";



    export default function NivelCarga(){

    //Para los use state

    const [tamaMapa, settamaMapa] = useState(true);
    const [tamaTabla, settamaTabla] = useState("6");
    const [VisibleL, setVisibleL]  = useState(true);
    const {Visible ,setisExpandido,} = useDataNivelCarga()
    const [Reset, setReset]  = useState(false);
    //el  useEffect
    useEffect(() =>{
        (Reset ? setReset(true):setReset(false));
        setVisibleL((Visible == undefined ? false:Visible));
    },[Reset])
   
     const ExpandirContraerTabla = () =>{  
           let result =   (tamaTabla === '6') ? "12" : "6";
           settamaTabla(result); 
     
          
     } 
     //se retorna la pagina o los botones para expandir/contraer la tabla y resetear datos
    return(
            <NivelCargaProvider>
                <PageTitle >{TituloNivelCarga}</PageTitle>
                <div className="container-fluid card card-rounded bg-transparent mt-1" style={{ width:'100%'}}   >
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm "  style={{width:'100%'}}  >
                <div className="col-sm-6 col-md-6 col-xs-6 mt-2">
                        <button className="btn btn-sm btn-primary m-2" title="Expadir contraer tabla" onClick={ExpandirContraerTabla}><i className="bi-display"></i></button>
                       <BotonesFiltros></BotonesFiltros> 
                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-5 mt-2">
                        <div style={{float:'right'}}>
                            <DataEventosTiempoClientes>{moment().format("MYYYY").toString()}</DataEventosTiempoClientes>
                        </div>
                    </div>
                    <div  className="col-sm-1 col-md-1 col-xs-1 mt-2">
                        <div style={{float:'right'}}>
                            <div style={{paddingTop:'6px'}}></div>
                            <Indicador>{VisibleL}</Indicador>
                            <IndicadorCargado>{VisibleL}</IndicadorCargado>
                        </div>
                    </div>
                </div>
                <div className="row  col-sm-12 col-md-12 col-xs-12 rounded border  mt-1 mb-2 shadow-sm "  style={{width:'100%'}}  >
                <Principal ExpandirContraerTabla={ExpandirContraerTabla} tamaTabla={tamaTabla} tamaMapa={tamaMapa} ResetearDatos={Reset}></Principal>
                </div> 
                </div>
             
            </NivelCargaProvider>
    )
}
