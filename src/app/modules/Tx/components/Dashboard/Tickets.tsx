import { useEffect, useState } from "react";
import { useDataDashboard } from "../../core/DashboardProvider";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../setup";
import { UserModelSyscaf } from "../../../auth/models/UserModel";


const Tickets: React.FC = () => {
    const [DataAdmin, setDataAdmin] = useState<any>(null);
    const [Database, setDatabase] = useState<any>(null);
    const [Datatipo, setDatatipo] = useState<any>(null);
    const [DataEstado, setDataEstado] = useState<any>(null);
    const [DataAgente, setAgente] = useState<any>(null);
    const [dataTickets, setDataTickets] = useState<any[]>([]);
    const { DataTk, DataFiltradaTk, Filtrado, setFiltradoTk, FiltradoTk, setDataFiltradaTk } = useDataDashboard()

    // informacion del usuario almacenado en el sistema
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);
    // pinta la grafica si  se ha filtrado

    useEffect(() => {
        if (dataTickets.length > 0)
            PintarGraficas(dataTickets)
    }, [dataTickets]);

    useEffect(() => {

        if (DataTk != undefined && DataTk['Ticket'] != undefined && model.perfil != null && model.perfil != undefined) {
            // filtra la informacion por el administrador de flota que este ingresadno
            // si no es puede ver toda la informacion
            const datafiltradaporadmin = DataTk['Ticket'].filter(
                (f: any) => (model.perfil == "118" && f.administrador.includes(model.Id)) || model.perfil != "118"
            )
            setDataTickets(datafiltradaporadmin);
            PintarGraficas(datafiltradaporadmin);

        }
    }, [DataTk]);

    useEffect(() => {


        let administrador = {
            options: {
                chart: {
                    id: 'apexchart-administrador',
                },

            },
            series: [],
        }
        let base = {
            options: {
                chart: {
                    id: 'apexchart-base',
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    }
                }
            },
            series: [],

        }
        let tipo = {
            options: {
                chart: {
                    id: 'apexchart-tipo',
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    }
                }
            },
            series: [],

        }
        let Estados = {
            options: {
                chart: {
                    id: 'apexchart-estados',
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    }
                }
            },
            series: [],

        }
        let Agente = {
            options: {
                chart: {
                    id: 'apexchart-agentes',
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: true,
                    style: {
                        colors: ['#424249']
                    }
                }
            },
            series: [],

        }
        setDataAdmin(administrador);
        setDatabase(base);
        setDatatipo(tipo);
        setDataEstado(Estados);
        setAgente(Agente);
        //setSemanas(opciones);
        return function cleanUp() {
            //SE DEBE DESTRUIR EL OBJETO CHART
        };
    }, [])
    const PintarGraficas = (Dt: any[]) => {
        if (Dt != undefined) {
            let Datos = new Array();
            let arrayEstados = new Array();
            let arrayVerticaTipo = new Array();
            let agrupadorGeneral = Dt.map((item: any) => {
                return item.administrador;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            //Verticales
            let agrupadortipo = Dt.map((item: any) => {
                return (item.base == undefined) ? item.Base : item.base;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            let Semana = Dt.map((item: any) => {
                return item.fecha;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });

            agrupadortipo.map(function (item: any) {
                Semana.map(function (itemSemana: any) {
                    let filtroEstado = Dt.filter(function (val: any) {
                        return (val.fecha == itemSemana && val.base == item);
                    });
                    arrayEstados.push([{
                        x: item,
                        y: filtroEstado.length
                    }]);

                });
            });
            // Vertical po Tipo
            let ArupadorVertical = Dt.map((item: any) => {
                return (item.tipodeTicket == undefined) ? item.TipodeTicket : item.tipodeTicket;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            let SemanaVertical = Dt.map((item: any) => {
                return item.fecha;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            ArupadorVertical.map(function (item: any) {
                SemanaVertical.map(function (itemSemana: any) {
                    let filtroVertical = Dt.filter(function (val: any) {
                        return (val.fecha == itemSemana && val.tipodeTicket == item);
                    });
                    arrayVerticaTipo.push([{
                        x: item,
                        y: filtroVertical.length
                    }]);

                });
            });
            ApexCharts.exec('apexchart-tipo', 'updateOptions', {
                chart: {
                    fill: {
                        colors: ['#1f77b4', '#aec7e8']
                    },
                    toolbar: {
                        show: false
                    },

                },
                colors: ['#1f77b4', '#aec7e8'],
            }
            );
            ApexCharts.exec('apexchart-tipo', 'updateOptions', {
                // Para los nombres de la serie
                //para que la lengenda me salga en la parte de abajo
                labels: ArupadorVertical.filter((e: any) => e),
                legend: {
                    show: true,
                    position: 'bottom'
                },
                tooltip: {
                    y: {
                        formatter: function (value: any, serie: any, index: any) {
                            return `${serie.w.config.labels[serie.dataPointIndex]} : ${value}`
                        }
                    }
                },
                //para darle forma a los totales
                plotOptions: {
                    bar: {
                        horizontal: true
                    }
                }
            });
            // actializar los datos
            ApexCharts.exec('apexchart-tipo', 'updateSeries',
                [
                    {
                        name: [...SemanaVertical],
                        data: arrayVerticaTipo.map((val) => {
                            return val[0].y;
                        })
                    }
                ]
            );
            //Fin
            ApexCharts.exec('apexchart-base', 'updateOptions', {
                chart: {
                    fill: {
                        colors: ['#1f77b4', '#aec7e8']
                    },
                    toolbar: {
                        show: false
                    },

                },
                colors: ['#1f77b4', '#aec7e8'],
            }
            );
            ApexCharts.exec('apexchart-base', 'updateOptions', {
                // Para los nombres de la serie
                //para que la lengenda me salga en la parte de abajo
                labels: agrupadortipo.filter((e: any) => e),
                legend: {
                    show: true,
                    position: 'bottom'
                },
                tooltip: {
                    y: {
                        formatter: function (value: any, serie: any, index: any) {
                            return `${serie.w.config.labels[serie.dataPointIndex]} : ${value}`
                        }
                    }
                },
                //para darle forma a los totales
                plotOptions: {
                    bar: {
                        horizontal: true
                    }
                }
            });

            // actializar los datos
            ApexCharts.exec('apexchart-base', 'updateSeries',
                [
                    {
                        name: [...Semana],
                        data: arrayEstados.map((val) => {
                            return val[0].y;
                        })
                    }
                ]
            );
            /*Admins */
            agrupadorGeneral?.map(function (item: any) {
                if (item != null) {
                    let totalAdmon = Dt?.filter(function (data: any, index: any) {
                        if (data.administrador == item)
                            return data.administrador
                    }).length;
                    Datos.push(totalAdmon);
                }
            });
            ApexCharts.exec('apexchart-administrador', 'updateOptions', {
                chart: {
                    fill: {
                        colors: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
                    },
                    toolbar: {
                        show: false
                    },

                },
                colors: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
            }
            );
            let labels = agrupadorGeneral?.map((e: any) => {
                if (e != null) {
                    if (e.split(" - ")[1] == undefined) {
                        return e.split(" - ")[0];
                    }
                    else {
                        return e.split(" - ")[1]
                    }
                }
            }).filter((e: any) => e)
            ApexCharts.exec('apexchart-administrador', 'updateOptions', {
                // Para los nombres de la serie
                //para que la lengenda me salga en la parte de abajo
                labels: labels,
                legend: {
                    show: true,
                    position: 'bottom'
                },
            });
            // actializar los datos
            ApexCharts.exec('apexchart-administrador', 'updateSeries', Datos)

            // grafica por estaod

            const agrupadoporestado = Dt.reduce((p: any, c: any) => {
                // filtramos por estado

                let exist = p.filter((f: any) => f.estado == c.estado);
                if (exist.length == 0)
                    p.push({ estado: c.estado, Total: 1 });
                else
                    exist[0].Total++;

                return p;

            }, []);
            ApexCharts.exec('apexchart-estados', 'updateOptions', {
                // Para los nombres de la serie
                //para que la lengenda me salga en la parte de abajo
                labels: agrupadoporestado.map((m: any) => m.estado),
                legend: {
                    show: true,
                    position: 'bottom'
                },
                tooltip: {
                    y: {
                        formatter: function (value: any, serie: any, index: any) {
                            return `${serie.w.config.labels[serie.dataPointIndex]} : ${value}`
                        }
                    }
                },
                //para darle forma a los totales
                plotOptions: {
                    bar: {
                        horizontal: true
                    }
                }
            });
            // actializar los datos
            ApexCharts.exec('apexchart-estados', 'updateSeries',
                [
                    {
                        name: [...Semana],
                        data: agrupadoporestado.map((m: any) => m.Total)
                    }
                ]
            );

            // GRAFICA DE AGENTES

            const agrupadoAgente = Dt.reduce((p: any, c: any) => {
                // filtramos por estado

                let exist = p.filter((f: any) => f.agente == c.agente);
                if (exist.length == 0)
                    p.push({ agente: c.agente, Total: 1 });
                else
                    exist[0].Total++;

                return p;

            }, []);
            ApexCharts.exec('apexchart-agentes', 'updateOptions', {
                // Para los nombres de la serie
                //para que la lengenda me salga en la parte de abajo
                labels: agrupadoAgente.map((m: any) => m.agente),
                legend: {
                    show: true,
                    position: 'bottom'
                },
                tooltip: {
                    y: {
                        formatter: function (value: any, serie: any, index: any) {
                            return `${serie.w.config.labels[serie.dataPointIndex]} : ${value}`
                        }
                    }
                },
                //para darle forma a los totales
                plotOptions: {
                    bar: {
                        horizontal: true
                    }
                }
            });
            // actializar los datos
            ApexCharts.exec('apexchart-agentes', 'updateSeries',
                [
                    {
                        name: [...Semana],
                        data: agrupadoAgente.map((m: any) => m.Total)
                    }
                ]
            );
        }
    }


    let MenuAdministradores: JSX.Element[] | undefined = [];
    /* DESDE AQUI LO HICE PARA PROBAR LAS CONEXIONES CREADAS */
    /* FIN DE LAS CONEXIONES */
    let AdminsTk: { usuarioIds: string, nombre: string }[] = [];
    AdminsTk.push({ "usuarioIds": "0", "nombre": "Todos" })
    if (dataTickets.length > 0)
        dataTickets.filter(function (item: any, index: any) {
            var nombre: string = (item.administrador != null || item.administrador != undefined ? (item.administrador.split(" - ")[1] == undefined ? item.administrador.split(" - ")[0] : item.administrador.split(" - ")[1]) : item.administrador);
            var id: string = (item.administrador != null || item.administrador != undefined ? item.administrador.split(" - ")[0] : item.administrador);
            var i = AdminsTk.findIndex(x => x.usuarioIds == id && x.nombre == nombre);
            if (i <= -1) {
                AdminsTk.push({ "nombre": nombre, "usuarioIds": id });
            }
            return null;
        });


    const FiltrarByAdminsTk = (event: any) => {
        let Usuario: string = event.target.attributes['data-bs-target'].value.split("--")[1];
        switch (Usuario) {
            case '0':
                setFiltradoTk(false);
                break;
            default:
                setFiltradoTk(true);
                if (DataTk != undefined) {
                    let DataResulttx =dataTickets.filter((val: any) => {
                        let user = val.administrador.split(" - ")[0];
                        return (user == Usuario)
                    });
                    setDataFiltradaTk({ "Ticket": DataResulttx });
                }
                break;
        }
    }
    MenuAdministradores = AdminsTk.map((val: any, index: any) => {
        return (
            <li key={val.nombre} className={`nav-item`} role="presentation">
                <button key={val.nombre} onClick={FiltrarByAdminsTk} className={`nav-link text-success ${(index == 0 ? 'active' : '')} fw-bolder`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target={`#pills--${val.usuarioIds}`} type="button" role="tab" aria-controls="pills-profile" aria-selected="false">{val.nombre}</button>
            </li>
        )
    })



    return (
        <>
            <div className="row">
                <div style={{ display: 'inline' }} className="col-sm-12 col-xl-12 col-md-12 col-lg-12" id="txpestana">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        {
                            (MenuAdministradores.length != 0) && ([...MenuAdministradores])
                        }
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active border" id="rep_assets_lst_admon_detalle_tx">
                            <div className="row">
                                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 ">
                                    <div className="text-center"><span id="EstadoCantidad" style={{ fontSize: '26px' }}></span></div>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="text-center pt-5">
                                        <label className="label label-sm fw-bolder">TICKET POR ADMINISTRADOR</label>
                                    </div>
                                    {
                                        (DataAdmin != null) && (DataAdmin.options != undefined) && (<ReactApexChart options={DataAdmin.options} series={DataAdmin.series} type="pie" height={350} />)
                                    }
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="text-center pt-5">
                                        <label className="label label-sm fw-bolder">TICKET POR BASE</label>
                                    </div>
                                    {
                                        (Database != null) && (Database.options != undefined) && (<ReactApexChart options={Database.options} series={Database.series} type="bar" height={300} />)
                                    }
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-5">
                                    <div className="text-center pt-5">
                                        <label className="label label-sm fw-bolder">TIPO TICKET</label>
                                    </div>
                                    {
                                        (Datatipo != null) && (Datatipo.options != undefined) && (<ReactApexChart options={Datatipo.options} series={Datatipo.series} type="bar" height={300} />)
                                    }
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-5">
                                    <div className="text-center pt-5">
                                        <label className="label label-sm fw-bolder">ESTADO TICKET</label>
                                    </div>
                                    {
                                        (DataEstado != null) && (DataEstado.options != undefined) && (<ReactApexChart options={DataEstado.options} series={DataEstado.series} type="bar" height={300} />)
                                    }
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-5">
                                    <div className="text-center pt-5">
                                        <label className="label label-sm fw-bolder">TOTAL AGENTES</label>
                                    </div>
                                    {
                                        (DataAgente != null) && (DataAgente.options != undefined) && (<ReactApexChart options={DataAgente.options} series={DataAgente.series} type="bar" height={300} />)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div style={{ display: (DataTk != undefined) ? 'none' : 'inline' }} className="col-sm-12 col-xl-12 col-md-12 col-lg-12 text-center" id="txpestananull">
                    <span className="font-weight-bold mb-3 text-muted" style={{ fontSize: '30px' }}>No hay datos que mostrar !!!</span>
                </div> */}
            </div>
        </>
    )
}
export { Tickets }