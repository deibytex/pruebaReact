import React, { useState } from "react";
import { useDataPreoperacional } from "../core/provider";

type Props = {
};

export const Indicadores: React.FC<Props> =  () => {

    const {vehiculosOperacion, ListadoVehiculoSinOperacion} = useDataPreoperacional() ;

    const [totalVehiculos, settotalVehiculos] = useState(0);
    const [vehiculosMovimiento, setvehiculosMovimiento] = useState(0);


    let vehiculosOperando = vehiculosOperacion;
    let vehiculosSinOperar = ListadoVehiculoSinOperacion;
    return(
        <>
        </>
    )
}