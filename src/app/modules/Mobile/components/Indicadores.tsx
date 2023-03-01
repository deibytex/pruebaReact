import React, { useEffect, useState } from "react";
import { object } from "yup";

import { useDataPreoperacional } from "../core/provider";
import { Preoperacional } from "../models/dataModels";

type Props = {
};

export const Indicadores: React.FC<Props> = () => {

    const { vehiculosOperacion, Encabezados, vehiculosSinPreoperacional } = useDataPreoperacional();

    const [vehiculosOperando, setvehiculosOperando] = useState(0);
    const [vehiculosSinOperacion, setvehiculosSinoperacion] = useState(0);
    const [vehiculosConPreoperacional, setvehiculosConPreoperacional] = useState(0);
    const [vehiculosConNovedad, setConNovedad] = useState(0);

    useEffect(() => {
        if (Object.keys(vehiculosOperacion).length != 0) {

            setvehiculosOperando(vehiculosOperacion['Operando']);
            setvehiculosSinoperacion(vehiculosOperacion['No Operando']);

            let filerNovedad = Encabezados?.filter(function (item) {
                return (item.Estado == 1)
            });

            setvehiculosConPreoperacional((Encabezados as Preoperacional[]).length);
            setConNovedad((filerNovedad as Preoperacional[]).length);
        }
    }, [vehiculosOperacion, Encabezados])




    if (Object.entries(vehiculosOperacion).length !== 0) {
        return (
            <>
                <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign: 'center' }}>
                    <label className="control-label label label-sm text-white" style={{ fontWeight: 'bold', textAlign: 'center' }}>Total Vehículos</label>
                    <div className="card text-black mb-3" style={{ marginTop: '5px', textAlign: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '30px' }}>{vehiculosOperando + vehiculosSinOperacion}</span>
                    </div>
                </div>
                <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign: 'center' }}>
                    <label className="control-label label label-sm text-white" style={{ fontWeight: 'bold', textAlign: 'center' }}>Vehículos con Movimiento</label>
                    <div className="card text-black mb-3" style={{ marginTop: '5px', textAlign: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '30px' }}>{vehiculosOperando}/{vehiculosOperando + vehiculosSinOperacion}</span>
                    </div>
                </div>
                <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign: 'center' }}>
                    <label className="control-label label label-sm text-white" style={{ fontWeight: 'bold', textAlign: 'center' }}>Vehículos con Preoperacional</label>
                    <div className="card text-black mb-3" style={{ marginTop: '5px', textAlign: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '30px' }}>{vehiculosConPreoperacional}/{vehiculosSinPreoperacional?.length}</span>
                    </div>
                </div>
                <div className="col-sm-3 col-md-3 col-xs-3" style={{ textAlign: 'center' }}>
                    <label className="control-label label label-sm text-white" style={{ fontWeight: 'bold', textAlign: 'center' }}>Vehículos con Novedad</label>
                    <div className="card text-black mb-3" style={{ marginTop: '5px', textAlign: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '30px' }}>{vehiculosConNovedad}/{vehiculosConPreoperacional}</span>
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <></>
        )
    }
}