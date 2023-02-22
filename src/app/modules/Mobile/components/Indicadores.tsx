import React, { useEffect, useState } from "react";
import { object } from "yup";

import { PreoperacionalProvider, useDataPreoperacional } from "../core/provider";
import { Preoperacional } from "../models/respuestas";
// import { Preoperacional } from "../models/respuestas";

type Props = {
};

export const Indicadores: React.FC<Props> =  () => {

    const {vehiculosOperacion, Encabezados} = useDataPreoperacional() ;

    const [vehiculosOperando, setvehiculosOperando] = useState(0);
    const [vehiculosSinOperacion, setvehiculosSinoperacion] = useState(0);
    const [vehiculosConPreoperacional, setvehiculosConPreoperacional] = useState(0);
    const [vehiculosConNovedad, setConNovedad] = useState(0);

    // let filtered: any[] = [];

    useEffect(() =>{
        setvehiculosOperando(vehiculosOperacion['Operando']);
        setvehiculosSinoperacion(vehiculosOperacion['No Operando']);

        let filerNovedad = Encabezados?.filter(function (item) {
            return (item.Estado == 1)
        });
   
        setvehiculosConPreoperacional((Encabezados as Preoperacional[]).length);
        setConNovedad((filerNovedad as Preoperacional[]).length);
    
    },[vehiculosOperacion, Encabezados])

    if(Object.entries(vehiculosOperacion).length !== 0 ){
        return(
            <>
                 {/* <div className="row g-0 g-xl-5 g-xxl-8 bg-syscaf-gris" style={{padding:'5px'}}> */}
                         {/* <div className="row"> */}
                            <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                                <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Total Vehículos</label>
                                <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                                    <span style={{fontWeight:'bold', fontSize:'30px'}}>{vehiculosOperando + vehiculosSinOperacion}</span>
                                </div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                                <label className="control-label label label-sm text-white" style={{fontWeight:'bold', textAlign:'center'}}>Vehículos con Movimiento</label>
                                <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                                    <span style={{fontWeight:'bold', fontSize:'30px'}}>{vehiculosOperando}</span>
                                </div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                            <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Vehículos con Preoperacional</label>
                            <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                                    <span style={{fontWeight:'bold', fontSize:'30px'}}>{vehiculosConPreoperacional}/{vehiculosOperando}</span>
                                </div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign:'center'}}>
                            <label className="control-label label label-sm text-white"  style={{fontWeight:'bold', textAlign:'center'}}>Vehículos con Novedad</label>
                            <div className="card text-black mb-3" style={{marginTop:'5px', textAlign:'center',flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height:'100px'}}>
                                    <span style={{fontWeight:'bold', fontSize:'30px'}}>{vehiculosConNovedad}/{vehiculosConPreoperacional}</span>
                                </div>
                            </div>
                         {/* </div> */}
                 {/* </div> */}
                </>
        )       
    }
    else {
     return(
        <></>
     )       
    }    
}