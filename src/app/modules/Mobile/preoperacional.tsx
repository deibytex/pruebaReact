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
import { isArray } from "lodash"

export default function FatigueDashboard() {

    // Traemos información del usuario Logueado
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    const model = (isAuthorized as UserModelSyscaf);
    const datosPreoperacional = JSON.parse(model.preoperacional) as any[];
    // Variables de seteo
    const [Fecha, setFecha] = useState("");
    const [Chidlren, setChildren] = useState("");
    const [Filtro, setFiltro] = useState("");
    const [clienteSeleccionado, setclienteSeleccionado] = useState<string>(datosPreoperacional[0]['ClienteIds']);
    const [clienteId, setclienteId] = useState<String>(datosPreoperacional[0]['ClienteId']);

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
        clienteid: clienteId,
        clienteIdS: clienteSeleccionado,
        fecha: moment(FechaServidor).format("YYYY-MM-DD"),
        userId: (model.Id?.toString())
    };

    // Use effect que setea fecha y children cuando cambia el usuario
    useEffect(() => {
        setFecha(moment(FechaServidor).format("YYYY-MM-DD"));
        setChildren(params);
    }, [isAuthorized, clienteSeleccionado]);

    // Función consulta con baese en los controles y usuario 
    const Consultar = () => {
        params = {
            clienteid: (model.clienteid?.toString()),
            clienteIdS: clienteSeleccionado,
            fecha: Fecha,
            userId: (model.Id?.toString())
        };
        setChildren(params);
    }

    function CargaListadoClientes() {
       
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema                  
                setclienteSeleccionado(e.currentTarget.value)
             let filter =   datosPreoperacional.filter(f => f["ClienteIds"] === e.currentTarget.value);
             if(filter.length > 0)
             setclienteId(filter[0]['ClienteId']);

            }} aria-label="" defaultValue={clienteSeleccionado}>
                {
                    datosPreoperacional?.map((element: any, i: any) => {
                        return (<option key={element['ClienteIds']} value={element['ClienteIds']}>{element['nombre']}</option>)
                    })
                }
            </Form.Select>
        );
    }
    function CargarSites() {
        
        let filtrado = datosPreoperacional.filter((value: any, index: any) => {
            console.log(value, clienteSeleccionado)
            return value["ClienteIds"] == clienteSeleccionado
        })
        // validamos que sean todos los sitios
        // o los especificamente selecccionados
        let arraySites: any[] = [];
        if (filtrado.length > 0) {
            if (isArray(filtrado[0]['sites'])) {
                filtrado[0]['sites'].map((value: any) => {
                    arraySites.push({ siteid: value['siteid'], nombre: value['nombre'] })
                });
            } else {
                arraySites.push({ siteid: filtrado[0]['sites'], nombre: "Todos" })
            }
        }
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema                  
                //setclienteSeleccionado(e.currentTarget.value)
            }} aria-label="" defaultValue={datosPreoperacional[0]['sites']}>
                {
                    arraySites.map((element: any, i: any) => {
                        return (<option key={element.siteid} value={element.siteid}>{element.nombre}</option>)
                    })
                }
            </Form.Select>
        );
    }

    //Validamos que children si tengo información
    if (Chidlren !== "") {
        //Retornamos pagina principal
        return (
            <>
                <PreoperacionalProvider>
                    <PageTitle >Preoperacional App</PageTitle>
                    <DataVehiculoOperando>{Chidlren}</DataVehiculoOperando>
                    <div className=" g-0 g-xl-10 g-xxl-8 mt-2" >
                        <div className="row rounded shadow-sm bg-secondary mt-2">
                            <div className="col-sm-6 col-md-6 col-xs-6 mt-2">
                                <label className="control-label label text-primary label-sm" style={{ fontWeight: 'bold' }}>Cliente:</label>
                                <CargaListadoClientes />
                            </div>
                            <div className="col-sm-6 col-md-6 col-xs-6 mt-2">
                                <label className="control-label label text-primary label-sm" style={{ fontWeight: 'bold' }}>Site:</label>
                                <CargarSites />
                            </div>
                        </div>
                        <div className="row rounded shadow-sm bg-secondary mt-2">
                            <div className="col-sm-2 col-md-2 col-xs-2 mt-2">
                                <label className="control-label label text-primary label-sm" style={{ fontWeight: 'bold' }}>Fecha inicial</label>
                                <FechaInicialControl />
                            </div>
                            <div className="col-sm-3 col-md-3 col-xs-3  mt-2">
                                <label className="form-check form-switch form-check-reverse">
                                    <input type="radio" name="tipofiltro" value={0} onChange={e => setFiltro(e.target.value)} />
                                    <span className="text-primary"> Aprobados</span>
                                </label>
                                <label className="form-check form-switch form-check-reverse  mt-2">
                                    <input type="radio" name="tipofiltro" value={1} onChange={e => setFiltro(e.target.value)} />
                                    <span className="text-primary"> No Aprobados</span>
                                </label>
                                <label className="form-check form-switch form-check-reverse  mt-2">
                                    <input type="radio" name="tipofiltro" value={2} defaultChecked={true} onChange={e => setFiltro(e.target.value)} />
                                    <span className="text-primary"> Todos</span>
                                </label>
                            </div>
                            <div className="col-sm-2 col-md-2 col-xs-2 mt-2">
                                <label className="control-label label label-sm"></label>
                                <div className=" ">
                                    <button className="btn btn-sm btn-success" title="Consultar" type="button" onClick={Consultar}><i className="bi-search"></i>Consultar</button>
                                </div>
                            </div>
                        </div>

                        <div className="row rounded shadow-sm bg-secondary mt-2">
                            <Indicadores />
                        </div>

                        <div className="row rounded shadow-sm bg-secondary mt-2">
                            <div className="col-xl-12">
                                <MOV_PanelCentral className="card-stretch mb-5 mb-xxl-8" clienteid={model.clienteid as string}
                                    fecha={Fecha} filtro={Filtro} />
                            </div>
                        </div>
                    </div>
                </PreoperacionalProvider>
            </>
        )
    } else
        return <></>


}

