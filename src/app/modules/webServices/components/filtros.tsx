import { useDataWebServices } from "../core/provider";
import React, { useEffect, useState } from "react";
import { dualList, clientes } from "../models/dataModels";
import { Button, Form } from "react-bootstrap-v5";
import BlockUi from "@availity/block-ui";
import DualListBox from "react-dual-listbox";
import { DateRangePicker } from "rsuite";
import moment from "moment";
type Props = {

}

export const ReportesWebService: React.FC<Props> = () => {

    //Data desde el provider
    const { clientes, clientesSelected, loader, fechaInicial, fechaFinal, setfechaInicial, setfechaFinal } = useDataWebServices();

    //Carga Inicial filtros
    const [lstClientes, setlstClientes] = useState<dualList[]>([]);
    const [selectedClientes, setselectedClientes] = useState([]);
    const [TipoReporte, setTipoReporte] = useState(1);

    useEffect(() => {

        let dual = clientes.map((item: clientes) => {
            return { "value": item.clienteIdS.toString(), "label": item.clienteNombre };
        }) as dualList[];

        setlstClientes(dual);

        setselectedClientes(clientesSelected);

        setfechaInicial(moment().add(-1, 'months').startOf('month').toDate());

        setfechaFinal(moment().add(-1, 'months').endOf('month').toDate());

    }, [clientes, clientesSelected]);


    useEffect(() => {

        console.log(fechaInicial);
        console.log(fechaFinal);

    }, [fechaInicial, fechaFinal, selectedClientes]);

    function SelectClientes() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstClientes}
                selected={selectedClientes}
                onChange={(selected: any) => setselectedClientes(selected)}
            />
        );
    }

    function SelectReporte() {
        return (
            <Form.Select className=" mb-3 " name="TipoReporte" value={TipoReporte} disabled onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setTipoReporte(e.currentTarget.value as any);
            }}>
                <option value={1}>Errores Viajes y Uso</option>
                <option value={2}>Configuración</option>
                <option value={3}>Eventos</option>
            </Form.Select>

        )
    }

    function DatePicker() {
        return (
            <DateRangePicker className="m-3" format="dd/MM/yyyy" value={[fechaInicial, fechaFinal]}
                onChange={(value, e) => {
                    if (value !== null) {

                        setfechaInicial(value[0]);
                        setfechaFinal(value[1])

                    }
                }}
            />
        )
    }

    const exportarReporte = () => {
        // let NombreReporte : string =(reporte === "EOAPC")? "Informe Conductor" : ((reporte === "EOAPV") ? "Informe Vehiculos" : "Informe Conductor Vehiculos");
        // setloader(true);
        // getReporteExcelSotramac(
        //     {
        //         FechaInicial :fechaInicial,
        //         FechaFinal :`${fechaFinal} 23:59:59`, 
        //         DriversIdS:driverSelected,
        //         assetsIds: assetSelected, 
        //         assetTypeId: (assetTypeId as string) , 
        //         SiteId: null
        //     } ,
        //     reporte)
        // .then((respuesta) => {
        //     const a = document.createElement("a");
        // a.style.display = "none";
        // document.body.appendChild(a);
        // var sampleArr = base64ToArrayBuffer(respuesta?.data);
        // const url = window.URL.createObjectURL(new Blob([sampleArr], {type: "application/excel"}));
        // a.href = url;
        // a.download = `${NombreReporte} ${fechaInicial}.xls`; 
        // a.click();
        // window.URL.revokeObjectURL(url);

        // setloader(false);
        // }).catch( () => {
        //     errorDialog("Descargar Informe", "Error al recibir datos del servidor.")
        //     setloader(false);
        // }


        // );
    }

    //Retornamos los controles de filtro
    return (
        <>
            <BlockUi tag="div" keepInView blocking={loader ?? false}  >
                <div className="row" style={{ padding: '10px' }}>
                    <div className="col-sm-4 col-md-3 col-xs-4">
                        <label className="control-label label label-sm" style={{ fontWeight: 'bold' }}>Tipo Reporte</label>
                        <SelectReporte />
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-xs-12">
                    <label className="control-label label label-sm text-primary m-3" style={{ fontWeight: 'bold' }}>Seleccione Clientes:</label>
                    <SelectClientes />
                </div>
                <div className="row">
                    <div className="col-sm-8 col-md-8 col-xs-8 col-lg-8">
                        <label className="control-label label  label-sm m-2 mt-4" style={{ fontWeight: 'bold' }}>Seleccione Fechas: </label>
                        <DatePicker />
                    </div>
                    <div className="col-sm-4 col-md-4 col-xs-4 col-lg-4" style={{ textAlign: 'right' }}>
                        <Button type="button" variant="secondary" onClick={() => { exportarReporte(); }}>
                            Generar Reporte
                        </Button>
                    </div>
                </div>

            </BlockUi>
        </>
    )
} 