import { useEffect, useState } from "react";
import { KTSVG } from "../../../../../../_start/helpers";
import { Indicador } from "./Indicadores/Indicador";
import { FiltroDashBoardData, GetDetalleLista, GetFallasSeniales, GetInfoDashBoardAdmin, GetLista, GettRequerimiento, SetRequerimiento } from "../../data/PostVentaData";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../setup";
import { UserModelSyscaf } from "../../../../auth/models/UserModel";
import { formatSimpleJsonColombia, locateFormatPercentNDijitos } from "../../../../../../_start/helpers/Helper";
import { AxiosResponse } from "axios";
import { Form, Modal } from "react-bootstrap-v5";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import BlockUi from "@availity/block-ui";
import confirmarDialog, { successDialog } from "../../../../../../_start/helpers/components/ConfirmDialog";
import { SetEstadoSyscaf } from "../../../../Tx/data/Reporte";
import { IndicadorSinTxAlto } from "./Indicadores/IndicadorSinTxAlto";
import { TotalFallas, dataIndicadores } from "../../mockData/indicadores";
import { Abiertos } from "./Indicadores/Abiertos";
import { Soporte } from "./Indicadores/Soportes";
import { Generico } from "./Indicadores/Generico";
export default function HomePostVenta() {
    //Esta es para tomar la cantidad de muestra de vehiculos de transmision.
    const MuestraTX = 20;
    const [show, setShow] = useState(false);
    const [showr, setShowr] = useState(false);
    const [dataTx, setDatatx] = useState<any[]>([]);
    const [TipoReporte, setTipoReporte] = useState<string>("1");
    const [dataUnidades, setDataUnidades] = useState<any[]>([]);
    const [dataSeniales, setdataSeniales] = useState<any[]>([]);
    const [dataConductores, setdataConductores] = useState<any[]>([]);
    const [dataTickets, setdataTickets] = useState<any[]>([]);
    const [TiketsDatos, setTiketsDatos] = useState<any[]>([]);
    const [dataEmpresas, setdataEmpresas] = useState<any[]>([]);
    const [TipoRequerimientos, setTipoRequerimientos] = useState<any[]>([]);
    const [TipoRequerimientosSeleccionado, setTipoRequerimientosSeleccionado] = useState<any>({ Nombre: "", Value: "" });
    const [EstadoRequerimientos, setEstadoRequerimientos] = useState<any[]>([]);
    const [EstadoRequerimientosSeleccionado, setEstadoRequerimientosSeleccionado] = useState<any>({ Nombre: "Creado", Value: "Estado" });
    const [Observaciones, setObservaciones] = useState<string>("");
    const [TituloModal, setTituloModal] = useState<string>("");
    const [TituloTicket, setTituloTicket] = useState<string>("Listado de tickets por estado");
    const [TxUltimaActualizacion, setTxUltimaActualizacion] = useState<string>("");
    const FechaFinal = moment().startOf('day').toDate();
    const FechaInicial = moment().startOf('day').add(-30, 'days').toDate();
    //ESTA ES PARA EL MODAL DINAMICO.
    const [sowL, setShowL] = useState<boolean>(false);
    const user = useSelector<RootState>(
        ({ auth }) => auth.user
    );
    const vUser = user as UserModelSyscaf;
    const [dataAdmin, setDataAdmin] = useState<any[]>([]);
    const [indicadores, setIndicadores] = useState<any>();
    const [loader, setLoader] = useState(false);
    const [Cabecera, setCabecera] = useState<{}>(

        {
            administrador: "",
            UsuarioId: "",
            assetid: "",
            clienteid: "",
            registrationNumber: "",
            description: "",
            nombrecliente: "",
            agente: ""
        }
    );
    var Indicadores = {
        Assets: 0,
        Clientes: 0,
        Conductores: 0,
        VehiculosSinTx: 0,
        Seniales: 0,
        Ticket: 0
    };

    var Data: any[] = [];
    const [Muestra, setMuestra] = useState<any[]>([]);
    const [Requerimientos, setRequerimientos] = useState<any[]>([]);
    const [TotalFallasCantidad, setTotalFallas] = useState<string>("4");
    //ESPACIO PARA LOS USEEFFECT
    useEffect(() => {
        if (vUser != undefined)
            ConsultasIniciales();
        return () => {
            setDataAdmin([]);
            setIndicadores([]);
            setTipoRequerimientos([]);
            setEstadoRequerimientos([]);
        }
    }, []);
    //Use  Effect para cambiar el titulo solo el titulo de los modales.
    useEffect(() => {
        switch (TipoReporte) {
            case '1':
            default:
                setTituloModal("Listado de vehiculos sin Tx");
                break;
            case '2':
                setTituloModal("Listado de unidades activas");
                break;
            case '3':
                setTituloModal("Listado de vehiculos sin señales o problemas");
                break;
            case '4':
                setTituloModal("Listado de conductores");
                break;
        }

    }, [TipoReporte])

    //FUNCION DE CREAR LOS REQUERIMIENTOS
    const CrearRequerimiento = (row: any) => {
        let data = (row.original == undefined ? row : row.original)
        setObservaciones("");
        if (data.estado == "Operando Normalmente") {
            setCabecera({
                administrador: vUser.Nombres,
                UsuarioId: vUser.Id,
                assetid: String(data.AssetId == undefined ? data.assetId : data.AssetId),
                clienteid: String(data.ClienteId == undefined ? data.clienteIdS : data.ClienteId),
                registrationNumber: data.registrationNumber,
                description: data.assetsDescription,
                nombrecliente: (data.clienteNombre == undefined ? data.clientenNombre : data.clienteNombre),
                agente: vUser.Nombres
            });
            setShowr(true);
            setShow(false);
        }
        else
            confirmarDialog(() => {
                setLoader(true);
                SetEstadoSyscaf((data.assetId == undefined ? data.AssetId.toString() : data.assetId.toString()), "7").then((response: AxiosResponse) => {
                    setCabecera({
                        administrador: vUser.Nombres,
                        UsuarioId: vUser.Id,
                        assetid: (data.AssetId == undefined ? data.assetId : data.AssetId),
                        clienteid: (data.ClienteId == undefined ? data.clienteIdS : data.ClienteId),
                        registrationNumber: data.registrationNumber,
                        description: data.assetsDescription,
                        nombrecliente: (data.clientenNombre == undefined ? data.clienteNombre : data.clientenNombre),
                        agente: vUser.Nombres
                    });
                    setShowr(true);
                    setShow(false);
                    setLoader(false);
                }).catch(() => {
                    console.log("Error de cambio de estado")
                    setLoader(false);
                })
            }, `¿El Vehículo con placa ${data.registrationNumber} del Cliente ${(data.clientenNombre == undefined ? data.clienteNombre : data.clientenNombre)} se encuentra operando normalmente?`, 'Si');
    }
    //Se cargan los tipos
    const CargarTipos = () => {
        return (
            <Form.Select className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let _seleccionado = TipoRequerimientos?.filter((value: any, index: any) => {
                    return value.Nombre === e.currentTarget.value;
                })
                setTipoRequerimientosSeleccionado(_seleccionado[0]);
            }} aria-label="Default select example">
                <option value={"Seleccione"}>Seleccione un tipo</option>
                {
                    TipoRequerimientos?.map((element: any, i: any) => {
                        let flag = (element.Nombre === (TipoRequerimientosSeleccionado != undefined ? TipoRequerimientosSeleccionado.Nombre : ""))
                        return (<option selected={flag} key={element.Nombre} defaultValue={(element.Nombre != null ? element.Nombre : "No definido")}>{element.Nombre}</option>)
                    })
                }
            </Form.Select>
        );
    }
    //Carga los estados y los tipos desde la DB    
    const CargarEstados = () => {

        return (
            <Form.Select disabled className=" mb-3 " onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema
                let seleccionado = EstadoRequerimientos?.filter((value: any, index: any) => {
                    return value.Nombre === e.currentTarget.value;
                });
                setEstadoRequerimientosSeleccionado(seleccionado[0])
            }} aria-label="Default select example">
                {
                    EstadoRequerimientos?.map((element: any, i: any) => {
                        let flag = (element.Nombre === (EstadoRequerimientosSeleccionado != undefined ? EstadoRequerimientosSeleccionado.Nombre : ""))
                        return (<option selected={flag} key={element.Nombre} value={(element.Nombre != null ? element.Nombre : "No definido")}>{element.Nombre}</option>)
                    })
                }
            </Form.Select>
        );
    }
    //Se guardan los requirimientos
    const EnviarRequerimiento = () => {
        let Obervaciones = [{ fecha: moment().format(formatSimpleJsonColombia), observacion: Observaciones, usuario: vUser.Nombres, estado: EstadoRequerimientosSeleccionado.Nombre }]
        let Campos = {};
        Campos["Tipo"] = TipoRequerimientosSeleccionado.Nombre;
        Campos["Cabecera"] = JSON.stringify([Cabecera]);
        Campos["Observaciones"] = JSON.stringify(Obervaciones);
        Campos["Estado"] = EstadoRequerimientosSeleccionado.Nombre;
        confirmarDialog(() => {
            setLoader(true)
            SetRequerimiento(Campos).then((response: AxiosResponse<any>) => {
                if (response.statusText == "OK") {
                    successDialog(`Operacion Exitosa, Numero de radicado es ${response.data[0].Consecutivo}`, "");
                }
                setShowr(false);
                setLoader(false)
            }).catch((e) => {
                console.log("Error ", e);
                setLoader(false)
            });
        }, `¿Esta completamente seguro que  desea crear el requerimiento?`, 'Guardar');

    }
    //ESPACIO PARA LAS COLUMNAS DE LAS TABLAS
    //SIN TX
    let Campos: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'clienteNombre',
                header: 'Cliente',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
            {
                accessorKey: 'assetsDescription',
                header: 'Placa',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
            {
                accessorKey: 'AVL',
                header: 'Ultimo AVL',
                enableHiding: true,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,
                Cell({ cell, column, row, table, }) {
                    return moment(row.original.AVL).format("DD/MM/YYYY");
                }
            },
            {
                accessorKey: 'estado',
                header: 'Estado',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,
                Cell({ cell, column, row, table, }) {
                    return RetornarEstado(row.original.estado);
                }
            }
        ];
    //VEHICULOS
    let CamposAsset: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'Base',
                header: 'Cliente',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
            {
                accessorKey: 'Description',
                header: 'Descripción',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
            {
                accessorKey: 'RegistrationNumber',
                header: 'Placa',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
        ];
    //SEÑALES
    let CamposSenial: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'clienteNombre',
                header: 'Cliente',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,
            },
            {
                accessorKey: 'assetsDescription',
                header: 'Placa',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
            {
                accessorKey: 'TFallas',
                header: 'Fallas',
                enableHiding: true,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,
            },
        ];
    //CONDUCTORES
    let CamposConductores: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'clienteNombre',
                header: 'Cliente',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
            {
                accessorKey: 'name',
                header: 'Nombre',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
        ];
    //TICKETS
    let Encabezado: MRT_ColumnDef<any>[] =
        [
            {
                accessorKey: 'administrador',
                header: 'Administrador',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,
                Cell({ cell, column, row, table, }) {
                    let Nombre = (row.original.Administrador != undefined ? (row.original.Administrador.split(" - ")[1] == undefined ? row.original.Administrador.split(" - ")[0] : row.original.Administrador.split(" - ")[1]) : "No admin");
                    return Nombre;
                },
            },
            {
                accessorKey: 'Base',
                header: 'Cliente',
                enableHiding: false,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,

            },
            {
                accessorKey: 'Ticket',
                header: 'Descripción',
                enableHiding: true,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,
            },
            {
                accessorKey: 'TipodeTicket',
                header: 'Tipo',
                enableHiding: true,
                size: 10,
                minSize: 10, //min size enforced during resizing
                maxSize: 10,
            },

        ];
    //PARA LOS COLORES EN LOS ESTADOS
    const RetornarEstado = (Estado: any) => {
        return (
            <>{(Estado == "Sin Respuesta del Cliente" ? <span className='badge bg-warning'>{Estado}</span> : (Estado == "En Mantenimiento" ? <span className='badge bg-info'>{Estado}</span> : (Estado == "Detenido" ? <span className='badge bg-danger'>{Estado}</span> : <span className='badge bg-success'>{Estado}</span>)))}</>
        )
    }

    //ESPACIO PARA LAS FUNCIONES DE CONSULTA
    const ConsultasIniciales = () => {
        setLoader(true);
        // traemos informacion de mocks para agilizar el desarrollo 
        //ELIMINAR
        const eslocal: boolean = process.env.REACT_APP_MOCK == 'true'
        if (eslocal == false) {
            const Assets = JSON.parse(dataIndicadores[0].Assets);
            let ClientesIds: any[] = [];
            let VehiculosSinTx: any[] = [];
            let requerimientos: any[] = [];
            let Vehiculosrequerimientos: any[] = [];
            setDataUnidades(Assets);
            //LSITADO DE CLIENTES O EMPRESAS
            const Clientes = JSON.parse(dataIndicadores[0].Clientes);
            ClientesIds = Clientes.map((e: any) => e.ClienteIdS);
            setdataEmpresas(Clientes);
            //LISTADO DE CONDUCTORES
            const Conductores = JSON.parse(dataIndicadores[0].Conductores);
            setdataConductores(Conductores);
            //VEHICULOS SIN TX
            VehiculosSinTx = JSON.parse(dataIndicadores[0].VehiculosSinTx);
            setTxUltimaActualizacion(moment(VehiculosSinTx[0].FechaTransmision).format(formatSimpleJsonColombia));
            setDatatx(VehiculosSinTx);
            //LISTADO DE TICKETS
            const Ticket = JSON.parse(dataIndicadores[0].Ticket);
            setdataTickets(Ticket);
            Indicadores.Assets = Assets.length;
            //SETEO DE INDICADORES
            Indicadores.Clientes = Clientes.length;
            Indicadores.Conductores = Conductores.length;
            Indicadores.VehiculosSinTx = VehiculosSinTx.length;
            Indicadores.Ticket = Ticket.length;

            let DatosCompletos = [...dataIndicadores];
            DatosCompletos[0].Seniales = JSON.stringify(TotalFallas);
            setdataSeniales(TotalFallas);
            //Para los indicadores adicionamos señales
            let ind: any = { ...Indicadores }
            ind['Seniales'] = TotalFallas.length;
            //seteamos las variables
            setIndicadores(Indicadores);
            setDataAdmin(DatosCompletos);
            //Cancelamos el cargando.

            //Saco a aparte todos los sin respuesta y operando normalmente de TX.
            let filtro = VehiculosSinTx.filter((item: any, index: any) => {
                let estado = (item.estado == undefined ? item.Estado : item.estado);
                if (estado == "Sin Respuesta del Cliente" || estado == "Operando Normalmente")
                    return item;
            });
            //Organizo el que tenga mayor cantidad de dias primero.
            let muestraFinal = filtro.slice(0, MuestraTX);
            muestraFinal.sort(function (a, b) {
                let bDias = (b.DiasSinTx == undefined ? b.diffAVL : b.DiasSinTx);
                let aDias = (a.DiasSinTx == undefined ? a.diffAVL : a.DiasSinTx)
                return bDias - aDias;
            });
            //Ya consultados los requeriminetos sacamos los vehiculos que tienen un requerimiento activo o creado.
            requerimientos.map((val: any) => {
                if (val.Estado == "Creado") {
                    let a = JSON.parse(val.Cabecera);
                    Vehiculosrequerimientos.push(a[0].assetid);
                }
            });
            //Elimino los vehiculos con un requerimiento creado o activo
            Vehiculosrequerimientos.map((item: any) => {
                let index = muestraFinal.findIndex((element) => element.assetId == item);
                if (index != -1)
                    muestraFinal.splice(index, 1);
            })
            //Verifico si los Vehiculos o la muestra de los vehiculos tienen falla de señales.
            if (TotalFallas.length != 0) {
                muestraFinal.reduce((a: any, b: any) => {
                    TotalFallas.map((val: any) => {
                        if (b.AssetId == val.AssetId)
                            b.TFallas = val.TFallas;
                        return b;
                    })
                }, [])
            }
            //Seteo toda la muestra final
            setMuestra(muestraFinal);
            //Cancelamos el cargando.
            setLoader(false);
        }
        else
            GetInfoDashBoardAdmin().then(
                (result) => {
                    ConsultasAnidadas(result);
                }).catch((e) => {
                    console.log("error", e)
                    setLoader(false);
                });
        //PARA LOS TIPOS DE REQUERIMIENTOS
        GetLista().then((response: AxiosResponse<any>) => {
            if (response.statusText == "OK") {
                GetDetalleLista(response.data[0].ListaId.toString()).then((resp: AxiosResponse<any>) => {
                    setTipoRequerimientos(resp.data.filter((val: any, index: any) => {
                        if (val.Valor == "Tipo")
                            return val;
                    }));
                    setEstadoRequerimientos(resp.data.filter((val: any, index: any) => {
                        if (val.Valor == "Estado")
                            return val;
                    }));
                }).catch(() => {
                    console.log("Error de consulta de detalles listas");
                    setLoader(false);
                });
            }
        }).catch(() => {
            console.log("Registre los parametros en listas para poder conseguir los parametros para los tipos de requerimientos con la sigla GOIREQ");
            setLoader(false);
        })

    };

    const ConsultasAnidadas = (result: any) => {
        //Espacio para variables a usar dentro de este procedimiento.
        Data = result.data;
        const data = result.data;
        let ClientesIds: any[] = [];
        let VehiculosSinTx: any[] = [];
        let requerimientos: any[] = [];
        let Vehiculosrequerimientos: any[] = [];

        if (data.length > 0) {
            const Assets = JSON.parse(data[0].Assets);
            setDataUnidades(Assets);
            //LSITADO DE CLIENTES O EMPRESAS
            const Clientes = JSON.parse(data[0].Clientes);
            ClientesIds = Clientes.map((e: any) => e.ClienteIdS);
            setdataEmpresas(Clientes);
            //LISTADO DE CONDUCTORES
            const Conductores = JSON.parse(data[0].Conductores);
            setdataConductores(Conductores);
            //VEHICULOS SIN TX
            VehiculosSinTx = (data[0].VehiculosSinTx == null ? [] : JSON.parse(data[0].VehiculosSinTx));
            //Para indicar cual fue la ultima fecha de actualizacion.
            setTxUltimaActualizacion(moment(VehiculosSinTx[0].FechaTransmision).format(formatSimpleJsonColombia));
            //Seteamos los valores de los vehiculos sin tx
            setDatatx(VehiculosSinTx);
            //LISTADO DE TICKETS
            const Ticket = (data[0].Ticket == null ? [] : JSON.parse(data[0].Ticket));
            setdataTickets(Ticket);
            Indicadores.Assets = Assets.length;
            //SETEO DE INDICADORES
            Indicadores.Clientes = Clientes.length;
            Indicadores.Conductores = Conductores.length;
            Indicadores.VehiculosSinTx = VehiculosSinTx.length;
            Indicadores.Ticket = Ticket.length;
        }
        //Obtengo los requimientos del sistema para revisar cuales vehiculos tienen algun requerimiento ya creado
        GettRequerimiento(FechaInicial, FechaFinal).then((response: AxiosResponse<any>) => {
            if (response.data.length != 0) {
                let Cabeceras = response.data.filter((val: any) => {
                    return JSON.parse(val.Cabecera);
                })
                requerimientos = Cabeceras;
                setRequerimientos(Cabeceras);
            }
        }).catch(() => {
            console.log("Error de consulta de detalles listas");
        })
        //indicador de señales.
        GetFallasSeniales(ClientesIds.join()).then((result: AxiosResponse<any>) => {
            //Como tengo una consulta anidada, debo traer datos anteriores para meterlos en otros.
            let DatosCompletos = [...Data];
            DatosCompletos[0].Seniales = JSON.stringify(result.data);
            setdataSeniales(result.data);
            //Para los indicadores adicionamos señales
            let ind: any = { ...Indicadores }
            ind['Seniales'] = result.data.length;
            Indicadores = {
                Assets: ind.Assets,
                Clientes: ind.Clientes,
                Conductores: ind.Conductores,
                VehiculosSinTx: ind.VehiculosSinTx,
                Seniales: ind.Seniales,
                Ticket: ind.Ticket
            }

            //seteamos las variables
            setIndicadores(Indicadores);
            setDataAdmin(DatosCompletos);
            //Saco a aparte todos los sin respuesta y operando normalmente de TX.
            let filtro = FiltroDashBoardData.getSoloDatosNecesarios(VehiculosSinTx);
            //Organizo el que tenga mayor cantidad de dias primero.
            let muestraFinal = filtro.slice(0, MuestraTX);
            //Los Ordeno de Mayor a menor
            muestraFinal = FiltroDashBoardData.getOrdenados(muestraFinal);
            //Ya consultados los requerimientos sacamos los vehiculos que tienen un requerimiento activo o creado.
            requerimientos.map((val: any) => {
                if (val.Estado == "Creado") {
                    let a = JSON.parse(val.Cabecera);
                    Vehiculosrequerimientos.push(a[0].assetid);
                }
            });
            //Elimino los vehiculos con un requerimiento creado o activo
            Vehiculosrequerimientos.map((item: any) => {
                let index = muestraFinal.findIndex((element) => element.assetId == item);
                if (index != -1)
                    muestraFinal.splice(index, 1);
            })
            //Verifico si los Vehiculos o la muestra de los vehiculos tienen falla de señales.
            if (result.data.length != 0)
                FiltroDashBoardData.getVehiculosFallas(muestraFinal, result.data);
            //Seteo toda la muestra final
            setMuestra(muestraFinal);
            //Cancelamos el cargando.
            setLoader(false);
        }).catch((e) => {
            console.log("error", e);
        });
    }
    //Para reutilizar modal de tablas.  
    const TablaDatos = (TipoData: any, show: boolean) => {
        useEffect(() => {
            return () => {
                //prueba
            }
        }, [])
        //Espacio para setear los datos s montar en la tabla
        let DataLocal: any[] = [];
        let EncabezadoLocal: MRT_ColumnDef<any>[] = [];
        switch (TipoData.TipoData) {
            case '1':
                DataLocal = dataTx;
                EncabezadoLocal = Campos;
                break;
            case '2':
                DataLocal = dataUnidades;
                EncabezadoLocal = CamposAsset
                break;
            case '3':
                DataLocal = dataSeniales;
                EncabezadoLocal = CamposSenial
                break;
            case '4':
                DataLocal = dataConductores;
                EncabezadoLocal = CamposConductores
                break;
            default:
                EncabezadoLocal = Campos;
                DataLocal = dataTx;
                break;
        }
        //RETORNA LO REALIZADO.
        return (
            <>
                {(show) && (DataLocal.length != 0) && (EncabezadoLocal.length != 0) && (<MaterialReactTable
                    localization={MRT_Localization_ES}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            muiTableHeadCellProps: {
                                align: 'center',
                            },
                            size: 100,
                        },
                    }}
                    muiTableHeadCellProps={{
                        sx: (theme) => ({
                            fontSize: 14,
                            fontStyle: 'bold',
                            color: 'rgb(27, 66, 94)'
                        }),
                    }}
                    columns={EncabezadoLocal}
                    data={DataLocal}
                    enableColumnOrdering
                    enableStickyHeader
                    enableDensityToggle={false}
                    enablePagination={false}
                    enableRowVirtualization
                    muiTableContainerProps={{
                        sx: { maxHeight: '400px' }, //give the table a max height
                    }}
                    initialState={{ density: 'compact' }}
                />)}
            </>
        )
    }
    //Pinta los Tickets Dinamicamente.
    const IndicadoresTickets = () => {
        let AgrupadoEstado = dataTickets
            .reduce((p: any, c: any) => {
                let name = c.Estado;
                p[name] = p[name] ?? [];
                p[name].push(c);
                return p;
            }, {});

        let campos = Object.entries(AgrupadoEstado).map((elem: any) => {
            return (
                <div key={elem[0]} className="row align-items-start">
                    <div title={elem[0]} className="col text-truncate">
                        {elem[0]}
                    </div>
                    <div className="col">
                        <span onClick={(e) => {
                            setTiketsDatos(elem[1].filter((e: any) => e.Estado == elem[0]));
                            setTituloTicket(`Listado de tickets ${elem[0]}`)
                            setShowL(true);
                        }} className="" style={{ cursor: 'pointer' }}>{elem[1].length}</span>
                    </div>
                </div>
            )
        });
        return (<>{campos}</>)
    }
    return (
        <>
            <BlockUi tag="div" keepInView blocking={loader ?? false} >
                <div className="row g-0 g-xl-5 g-xxl-8">
                    {(indicadores) && (<>
                        <div className="col-xl-4 pt-5">
                            <Indicador className=" shadow card-stretch  mb-5  mb-xxl-8" Titulo={`Total Empresa (${indicadores.Clientes})`}
                                Subtitulo=""
                                path="/media/icons/duotone/Home/Home-heart.svg">
                                {/* begin::Info */}
                                <div className="fw-bolder pt-8 fs-3">
                                    <span className="d-block">Total Unidades : <span className="" style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            setTipoReporte("2");
                                            setShow(true)
                                        }
                                        }> {indicadores.Assets}</span></span>
                                    <span className="d-block pt-2">Total Conductores: <span className="" style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            setTipoReporte("4");
                                            setShow(true)
                                        }
                                        }> {indicadores.Conductores}</span></span>
                                </div>
                                {/* end::Info */}
                            </Indicador>
                        </div>
                        <div className="col-xl-4 pt-5">
                            <Indicador   className=" shadow card-stretch  mb-5  mb-xxl-8" Titulo={`Novedades (${indicadores.VehiculosSinTx})`} 
                            Subtitulo="">
                                {/* begin::Info */}
                                <div className="fw-bolder text-muted pt-7 text-center fs-3">
                                    <div className="container">
                                        <div className="row align-items-start">

                                            <div className="col">

                                            </div>
                                            <div className="col">
                                                {/* % Flota */}
                                            </div>
                                        </div>
                                        <div className="row align-items-start">

                                            <div className="col ">
                                                Sin Tx: <span className="" style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        setTipoReporte("1");
                                                        setShow(true)
                                                    }
                                                    }> {indicadores.VehiculosSinTx}</span>
                                            </div>
                                            <div className="col">
                                                {locateFormatPercentNDijitos(indicadores.VehiculosSinTx / indicadores.Assets, 2)}
                                            </div>
                                        </div>
                                        <div className="row align-items-start">

                                            <div className="col">
                                                Sin Señales: <span className="" style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        setTipoReporte("3");
                                                        setShow(true)
                                                    }}>{indicadores.Seniales}</span>
                                            </div>
                                            <div className="col">
                                                {locateFormatPercentNDijitos(indicadores.Seniales / indicadores.Assets, 2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* end::Info */}
                            </Indicador>
                        </div>
                        <div className="col-xl-4 pt-5">
                            <Indicador className="shadow card-stretch  mb-5  mb-xxl-8" Titulo={"Tickets"} Subtitulo="">
                                <div className="fw-bolder text-muted pt-7 text-center">
                                    <div className="container">
                                      
                                        {/* Aqui los ticket Dinamicos */}
                                        <IndicadoresTickets></IndicadoresTickets>
                                    </div>

                                </div>
                            </Indicador>
                        </div>
                    </>)
                    }
                </div>
                {/* begin::Row */}
                <div className="">
                    <div className="row">
                        <div className="col-4">
                           
                                <div className="shadow rounded card">
                                    <div className="mt-5 mx-4">
                                        <h5>Vehículos Sin Tx</h5>
                                        <p className="text-muted">Últimos 15</p>
                                    </div>
                                    {Muestra.map((val: any, index: any) => {
                                        let DiasSinTX = (val.diffAVL == undefined ? val.DiasSinTx : val.diffAVL);
                                        // if(DiasSinTX >= 10)
                                        return (

                                            <div className="card rounded shadow mt-2 mx-4">
                                                <div className="bg-light-danger">
                                                
                                                    <span className="font-weight-light fs-3 text-gray-800">
                                                        {val.registrationNumber} - 
                                                        <span className="fw-bolder fs-3 text-gray-800"> {(DiasSinTX == undefined ? 0 : DiasSinTX)} días</span>
                                                        <span className="float-end">
                                                    <a
                                                        onClick={() => CrearRequerimiento(val)}
                                                        className="btn btn-primary btn-sm fw-bolder"
                                                        title={`Creación de requerimiento para el vehiculo ${val.registrationNumber}`}
                                                    >
                                                        <i className="bi-clipboard-check"></i>
                                                    </a>
                                                </span>
                                                    </span><br />
                                                    {
                                                        (val.TFallas == null || val.TFallas == "" || val.TFallas == undefined ? "" :
                                                            <span className="font-weight-light fs-3 text-gray-800">
                                                                Tiene Falla de
                                                                <span className="fw-bolder fs-3 text-gray-800"> {val.TFallas}/{TotalFallas} Señales</span>
                                                            </span>
                                                        )
                                                    }
                                                    
                                                </div>
                                                
                                            </div>



                                        )
                                        // else if(DiasSinTX>= 5)
                                        // return (
                                        //     <IndicadorSinTxMedio key={index} className={"card-stretch mb-5  mb-xxl-8"} placa={val.registrationNumber} dias={DiasSinTX} fallas={val.TFallas}>
                                        //          <a
                                        //              onClick={() =>  CrearRequerimiento(val)}
                                        //             className="btn btn-secondary btn-sm fw-bolder fs-6 ps-4 mt-6"
                                        //         >
                                        //             Req ST{" "}
                                        //             <KTSVG
                                        //                 className="svg-icon-3 me-0"
                                        //                 path="/media/icons/duotone/Navigation/Up-right.svg"
                                        //             />
                                        //         </a>
                                        //     </IndicadorSinTxMedio>
                                        // )
                                        // else
                                        // return (
                                        //     <IndicadorSinTxBajo key={index} className={"card-stretch mb-5  mb-xxl-8"} placa={val.registrationNumber} dias={DiasSinTX} fallas={val.TFallas}>
                                        //          <a
                                        //              onClick={() =>  CrearRequerimiento(val)}
                                        //             className="btn btn-secondary btn-sm fw-bolder fs-6 ps-4 mt-6"
                                        //         >
                                        //             Req ST{" "}
                                        //             <KTSVG
                                        //                 className="svg-icon-3 me-0"
                                        //                 path="/media/icons/duotone/Navigation/Up-right.svg"
                                        //             />
                                        //         </a>
                                        //     </IndicadorSinTxBajo>
                                        // )
                                    })}

                                </div>
                            
                          
                        </div>
                        <div className="col-8">
                            <div className="card shadow rounded" style={{height: 600}}>
                                <div className="mt-5 mx-5">
                                    <h5>Requerimientos Servicios Técnicos</h5>
                                    <p className="text-muted">Información o solicitud realizada al área de servicio técnico.</p>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4" >
                                            <Generico className={"bg-light-success shadow"} texto={"Abiertos"} indicador={"10"}></Generico>
                                        </div>
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                            <Generico className={"bg-light-info shadow"} texto={"Soporte"} indicador={"5"}></Generico>
                                        </div>
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                            <Generico className={"bg-light-info shadow"} texto={"Asignados"} indicador={"2"}></Generico>
                                        </div>
                                    </div>
                                </div>
                              {/**   <div className="mt-7">
                                    <h4>Requerimientos soportes</h4>
                                    <p className="text-muted">Información de solicitudes realizadas al área de soporte.</p>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                            <Generico className={"bg-light-info text-center"} texto={"Abiertos"} indicador={"2"}></Generico>
                                        </div>
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                            <Generico className={"bg-light-info"} texto={"Soporte"} indicador={"1"}></Generico>
                                        </div>
                                        <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                            <Generico className={"bg-light-info"} texto={"Ingenieria"} indicador={"3"}></Generico>
                                        </div>
                                    </div>
                                </div> */}
                            </div> 
                        </div>
                    </div>
                </div>
            </BlockUi>
            {(show && !showr) && (<Modal show={show} onHide={setShow} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{TituloModal}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container mb-5" style={{ display: (TipoReporte != "1" ? 'none' : 'block') }}>
                        <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                            <div className="text-center border border-5">
                                <label className="control-label label labels-sm">Ultima actualización</label><br />
                                <span className="mx-4 fs-3 text-muted">{TxUltimaActualizacion}</span>
                            </div>
                        </div>
                        <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                        </div>
                        <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                        </div>
                    </div>

                    {(show) && (!showr) && (
                        <TablaDatos show={show} TipoData={TipoReporte}></TablaDatos>
                    )}
                </Modal.Body>
            </Modal>)}

            {(showr && !show) && (<Modal show={showr} onHide={setShowr} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Creación de requerimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="">
                                    <label className="label label-sm control-label fw-bolder">Tipo</label>
                                </div>
                                {(showr) && (<CargarTipos></CargarTipos>)}
                            </div>
                            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="">
                                    <label className="label label-sm control-label fw-bolder">Estado requerimiento</label>
                                </div>
                                {(showr) && (<CargarEstados></CargarEstados>)}
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div className="mb-3">
                                    <label className="form-label fw-bolder">Observaciones</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1"
                                        value={Observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        rows={3}>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-sm btn-primary" onClick={EnviarRequerimiento}>Guardar</button>
                    <button className="btn btn-sm btn-secundary" onClick={() => { setShowr(false); setShow(true); }}>Cancelar</button>
                </Modal.Footer>
            </Modal>)}
            {(sowL) && (TiketsDatos.length != 0) && (<Modal show={sowL} onHide={setShowL} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{TituloTicket}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(sowL) && (TiketsDatos.length != 0) && (<MaterialReactTable
                        localization={MRT_Localization_ES}
                        displayColumnDefOptions={{
                            'mrt-row-actions': {
                                muiTableHeadCellProps: {
                                    align: 'center',
                                },
                                size: 100,
                            },
                        }}
                        muiTableHeadCellProps={{
                            sx: (theme) => ({
                                fontSize: 14,
                                fontStyle: 'bold',
                                color: 'rgb(27, 66, 94)'
                            }),
                        }}
                        columns={Encabezado}
                        data={TiketsDatos}
                        enableColumnOrdering

                        enableStickyHeader
                        enableDensityToggle={false}
                        enablePagination={false}
                        enableRowVirtualization
                        muiTableContainerProps={{
                            sx: { maxHeight: '400px' }, //give the table a max height
                        }}
                        initialState={{ density: 'compact' }}
                    />)}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-sm btn-secundary" onClick={() => { setShowL(false); }}>Cancelar</button>
                </Modal.Footer>
            </Modal>)}

            {/* end::Row */}
        </>
    )
}