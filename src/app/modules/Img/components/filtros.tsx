import { useDataImg } from "../core/provider";
import React, { useEffect, useState } from "react";
import { dualList, clientes } from "../models/dataModels";
import { Form } from "react-bootstrap-v5";
import BlockUi from "@availity/block-ui";
import DualListBox from "react-dual-listbox";
import { DateRangePicker } from "rsuite";
import { ExportarExcel } from "./exportarExcel";
type Props = {

}

export const ReportesImg: React.FC<Props> = () => {

    //Data desde el provider
    const { clientes, clientesSelected, loader, fechaInicial, fechaFinal, tipoReporte
            , settipoReporte, setclientesSelected, setfechaInicial, setfechaFinal } = useDataImg();

    //Carga Inicial filtros
    const [lstClientes, setlstClientes] = useState<dualList[]>([]);

    useEffect(() => {

        let dual = clientes.map((item: clientes) => {
            return { "value": item.clienteIdS.toString(), "label": item.clienteNombre };
        }) as dualList[];

        setlstClientes(dual);

    }, [clientes]);


    

    function SelectClientes() {
        return (
            <DualListBox className=" mb-3 " canFilter
                options={lstClientes}
                selected={clientesSelected}
                onChange={(selected: any) => setclientesSelected(selected)}
            />
        );
    }

    function SelectReporte() {
        return (
            <Form.Select className=" mb-3 " name="TipoReporte" value={tipoReporte} disabled onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                settipoReporte(e.currentTarget.value);
            }}>
                <option value={1}>Errores Viajes y Uso</option>
                <option value={2}>Configuración</option>
                <option value={3}>Eventos</option>
            </Form.Select>

        )
    }

    function DatePicker() {
        return (
            <DateRangePicker className="m-3" format="dd/MM/yyyy" value={[fechaInicial as Date, fechaFinal as Date]}
                onChange={(value, e) => {
                    if (value !== null) {
                        setfechaInicial(value[0]);
                        setfechaFinal(value[1])
                    }
                }}
            />
        )
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
                    <ExportarExcel />
                </div>

            </BlockUi>
        </>
    )
} 