import { useDataSotramac } from "../core/provider";
import React, { useEffect, useState } from "react";
import { AssetsTypes, DetalleListas, Listas, Sites } from "../models/dataModels";
import { Button, Form } from "react-bootstrap-v5";

import "../../../../../node_modules/@availity/block-ui/src/BlockUi.css";
import "../../../../../node_modules/@availity/block-ui/src/Loader.css";

import { Fechas } from "./filtrosFechas";
import { SelectAssetsDrivers } from "./filtrosAssetsDrivers";
type Props = {

}

export const ReporteExcelencia: React.FC<Props> = () => {

    //Retornamos los controles de filtro
    return (
        <>
            <div className="mt-5 justify-content-end" style={{ textAlign: 'right' }}>
                <Button type="button" variant="secondary" className="m-3">
                    Visualizar Reporte
                </Button>
                <Button type="button" variant="secondary" className="m-3">
                    Generar Reporte
                </Button>
            </div>
        </>
    )
} 