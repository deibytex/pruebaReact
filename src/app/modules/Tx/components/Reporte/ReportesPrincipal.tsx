import BlockUi from "@availity/block-ui"
import { CargaClientes, ExportarExcelBoton, useDataReporte } from "../../core/ReporteProvider"
import { TableReporte } from "./TableReporte"
import moment from "moment"
import { formatFechasView } from "../../../../../_start/helpers/Helper"

export default function ReportesPrincipal() {
    const { Cargando, Fecha, Data } = useDataReporte()
    return (
        <>
            <BlockUi tag="span" className="shadow-sm" keepInView blocking={(Cargando == undefined ? true : Cargando)}>


                <div className="d-flex justify-content-between ">
                    <div className="mx-auto">
                        <div className="ms-3 text-center">
                            <h3 className="mb-0">Listado Vehículos Sin Tx</h3>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <div className="shadow rounded  text-center m-4">
                        <div className="row m-1">
                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                <label className="label label-sm control-label fs-4">Última Actualización</label>
                                <div>
                                    <span className="" style={{ fontSize: '14px' }}>{moment(Fecha).format(formatFechasView) ?? "Sin calcular"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shadow rounded  text-center m-4">
                        <div className="row m-1">
                            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                <label className="label label-sm control-label fs-4">Total Sin TX</label>
                                <div>
                                    <span className="" style={{ fontSize: '14px' }}>{Data?.length ?? "N/A"}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="shadow rounded  text-center m-4">
                        <div className="row m-1">
                            <div className="d-flex d-flex-column justify-content-start mt-2 ">

                                <label className="form-label m-2 mt-6"> Clientes: </label>
                                <CargaClientes ></CargaClientes>
                                <ExportarExcelBoton></ExportarExcelBoton>

                            </div>

                        </div>
                    </div>
                </div>


                <div className="bg-primary  mt-5 shadow-sm">
                    <div className="card card-border">
                        <TableReporte></TableReporte>
                    </div>
                </div>
            </BlockUi>
        </>

    )
}
