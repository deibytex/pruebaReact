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

    // Traemos información del usuario Logueado
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );
        
    const model = (isAuthorized as UserModelSyscaf);
    
    // Variables de seteo
    const [Fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
    const [Chidlren, setChildren] = useState("");
    const [Filtro, setFiltro] = useState("");
    
    //Control Fecha
    function FechaInicialControl() {
        return (
            <Form.Control className=" mb-3 " value={Fecha} type="date" name="fechaini" placeholder="Seleccione una fecha" onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                setFecha(e.currentTarget.value);
            }} />
        )
    }

    // Inicializamos y asignamos el objeto children que usara el provider para modificarse
    let params: any = {};

    params = {
        clienteid: (model.clienteid?.toString()),
        clienteIdS: "895",
        fecha: moment(FechaServidor).format("YYYYMMDD"),
        userId: (model.Id?.toString())
    };

    // Use effect que setea fecha y children cuando cambia el usuario
    useEffect(() => {
        setFecha(moment(FechaServidor).format("YYYYMMDD"));
        setChildren(params);
    }, [isAuthorized]);

    // Función consulta con baese en los controles y usuario 
    const Consultar = () => {
        params = {
            clienteid: (model.clienteid?.toString()),
            clienteIdS: "895",
            fecha: Fecha,
            userId: (model.Id?.toString())
        };
        setChildren(params);
    }
    //Validamos que children si tengo información
    if (Chidlren !== ""){
        //Retornamos pagina principal
        return (
            <>
                <PreoperacionalProvider>
                    <PageTitle >Preoperacional App</PageTitle>
                    <DataVehiculoOperando>{Chidlren}</DataVehiculoOperando>
                    <div className="row g-0 g-xl-10 g-xxl-8 bg-transparent card card-rounded mt-2 text-primary" style={{ padding: '20px' }}>
                        <div className="row  rounded shadow-sm bg-secondary">
                            <div className="col-sm-2 col-md-2 col-xs-2 mt-2">
                                <label className="control-label label  label-sm" style={{ fontWeight: 'bold' }}>Fecha</label>
                                <FechaInicialControl />
                            </div>
                            <div className="col-sm-3 col-md-3 col-xs-3 mt-2">
                                <label className="form-check form-switch form-check-reverse">
                                    <input type="radio" name="tipofiltro" value={0} onChange={e => setFiltro(e.target.value)} />
                                    <span className="text-primary"> Aprobados</span>
                                </label>
                                <label className="form-check form-switch form-check-reverse">
                                    <input type="radio" name="tipofiltro" value={1} onChange={e => setFiltro(e.target.value)} />
                                    <span className="text-primary"> No Aprobados</span>
                                </label>
                                <label className="form-check form-switch form-check-reverse">
                                    <input type="radio" name="tipofiltro" value={2} defaultChecked={true} onChange={e => setFiltro(e.target.value)} />
                                    <span className="text-primary"> Todos</span>
                                </label>
                            </div>
                            <div className="col-sm-2 col-md-2 col-xs-2">
                                <label className="control-label label label-sm"></label>
                                <div className=" ">
                                    <button className="btn btn-sm btn-success" title="Consultar" type="button" onClick={Consultar}><i className="bi-search"></i>Consultar</button>
                                </div>
                            </div>
                        </div>
    
                        <div className="row bg-secondary rounded mt-2">
                            <Indicadores  />
                        </div>
    
                        <div className="row bg-secondary mt-2 rounded shadow-sm">
                            <div className="col-xl-12 ">
                                <MOV_PanelCentral className="card-stretch mb-5 mb-xxl-8" clienteid={model.clienteid as string}
                                    fecha={Fecha} filtro={Filtro} />
                            </div>
                        </div>
                    </div>
                </PreoperacionalProvider>
            </>
            )
    }else 
    return <></>
    
    
}

