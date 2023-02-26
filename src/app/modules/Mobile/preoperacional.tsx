import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../setup"
import { PageTitle } from "../../../_start/layout/core"
import { UserModelSyscaf } from "../auth/models/UserModel"
import { DataVehiculoOperando, PreoperacionalProvider } from "./core/provider"
import { Indicadores } from "./components/Indicadores"
import { MOV_PanelCentral } from "./components/panelCentral"
import { Form } from "react-bootstrap-v5"
import moment from "moment"
import { FechaServidor } from "../../../_start/helpers/Helper"

export default function FatigueDashboard() {

    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    const model = (isAuthorized as UserModelSyscaf);

    const [Fecha, setFecha] = useState("");
    const [Chidlren, setChildren] = useState("");
    const [Filtro, setFiltro] = useState("");

    function FechaInicialControl() {
        return (
            <Form.Control className=" mb-3 " value={Fecha} type="date" name="fechaini" placeholder="Seleccione una fecha" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setFecha(e.currentTarget.value);
            }} />
        )
    }

    let params: any = {};

    params = {
        clienteid: (model.clienteid?.toString()),
        clienteIdS: "895",
        fecha: moment(FechaServidor).format("YYYYMMDD"),
        userId: (model.Id?.toString())
    };

    useEffect(() => {
        setFecha(moment(FechaServidor).format("YYYYMMDD"));
        setChildren(params);
    }, [isAuthorized]);

    const Consultar = () => {
        params = {
            clienteid: (model.clienteid?.toString()),
            clienteIdS: "895",
            fecha: Fecha,
            userId: (model.Id?.toString())
        };
        setChildren(params);
    }

    return (
        <>
            <PreoperacionalProvider>
                <PageTitle >Preoperacional App</PageTitle>
                <DataVehiculoOperando>{Chidlren}</DataVehiculoOperando>
                <div className="row g-0 g-xl-10 g-xxl-8 bg-syscaf-gris" style={{ padding: '20px' }}>
                    <div className="row">
                        <div className="col-sm-2 col-md-2 col-xs-2">
                            <label className="control-label label text-white label-sm" style={{ fontWeight: 'bold' }}>Fecha inicial</label>
                            <FechaInicialControl />
                        </div>
                        <div className="col-sm-3 col-md-3 col-xs-3">
                            <label className="form-check form-switch form-check-reverse">
                                <input type="radio" name="tipofiltro" value={0} onChange={e => setFiltro(e.target.value)} />
                                <span className="text-white"> Aprobados</span>
                            </label>
                            <label className="form-check form-switch form-check-reverse">
                                <input type="radio" name="tipofiltro" value={1} onChange={e => setFiltro(e.target.value)} />
                                <span className="text-white"> No Aprobados</span>
                            </label>
                            <label className="form-check form-switch form-check-reverse">
                                <input type="radio" name="tipofiltro" value={2} defaultChecked={true} onChange={e => setFiltro(e.target.value)} />
                                <span className="text-white"> Todos</span>
                            </label>
                        </div>
                        <div className="col-sm-2 col-md-2 col-xs-2">
                            <label className="control-label label label-sm"></label>
                            <div className=" ">
                                <button className="btn btn-sm btn-success" title="Consultar" type="button" onClick={Consultar}><i className="bi-search"></i>Consultar</button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <Indicadores />
                    </div>

                    <div className="row">
                        <div className="col-xl-12">
                            <MOV_PanelCentral className="card-stretch mb-5 mb-xxl-8" clienteid={model.clienteid as string}
                                fecha={Fecha} filtro={Filtro} />
                        </div>
                    </div>
                </div>
            </PreoperacionalProvider>
        </>
    )
}

