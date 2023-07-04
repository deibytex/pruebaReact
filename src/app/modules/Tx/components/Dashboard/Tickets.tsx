import { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDataDashboard } from "../../core/DashboardProvider";
import { GetSnapShotTickets } from "../../data/Dashboard";
import ReactApexChart from "react-apexcharts";

const Tickets: React.FC = () => {
    const [DataAdmin, setDataAdmin] = useState<any>(null);
    const [Database, setDatabase] = useState<any>(null);
    const [Datatipo, setDatatipo] = useState<any>(null);
    const { DataTk, setDataTk, DataFiltradaTk, Filtrado } = useDataDashboard()
    useEffect(() => {
        let administrador = {
            options: {
                chart: {
                    id: 'apexchart-administrador',
                }
            },
            series: [],
            dataLabels: {
                enabled: false
            }
        }
        let base = {
            options: {
                chart: {
                    id: 'apexchart-base',
                }
            },
            series: [],
            dataLabels: {
                enabled: false
            }
        }
        let tipo = {
            options: {
                chart: {
                    id: 'apexchart-tipo',
                }
            },
            series: [],
            dataLabels: {
                enabled: false
            }
        }
        setDataAdmin(administrador);
        setDatabase(base);
        setDatatipo(tipo);
        //setSemanas(opciones);
        return function cleanUp() {
            //SE DEBE DESTRUIR EL OBJETO CHART
        };
    }, [])
    const PintarGraficas = () => {
        if (DataTk != undefined) {
            let Datos = new Array();
            let arrayEstados = new Array();
            let arrayVerticaTipo = new Array();
            let agrupadorGeneral = DataTk['Ticket'].map((item: any) => {
                return item.administrador;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            //Verticales
            let agrupadortipo = DataTk['Ticket'].map((item: any) => {
                return (item.base == undefined) ? item.Base : item.base;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            let Semana = DataTk['Ticket'].map((item: any) => {
                return item.fecha;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });

            agrupadortipo.map(function (item: any) {
                Semana.map(function (itemSemana: any) {
                    let filtroEstado = DataTk['Ticket'].filter(function (val: any) {
                        return (val.fecha == itemSemana && val.base == item);
                    });
                    arrayEstados.push([{
                        x: item,
                        y: filtroEstado.length
                    }]);

                });
            });
            // Vertical po Tipo
            let ArupadorVertical = DataTk['Ticket'].map((item: any) => {
                return (item.tipodeTicket == undefined) ? item.TipodeTicket : item.tipodeTicket;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            let SemanaVertical = DataTk['Ticket'].map((item: any) => {
                return item.fecha;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            ArupadorVertical.map(function (item: any) {
                SemanaVertical.map(function (itemSemana: any) {
                    let filtroVertical = DataTk['Ticket'].filter(function (val: any) {
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
            let valores =
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
                if(item != null){
                    let totalAdmon = DataTk['Ticket']?.filter(function (data: any, index: any) {
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
                if(e != null){
                    if(e.split(" - ")[1] == undefined){
                        return e.split(" - ")[0];
                    }
                    else{
                        return e.split(" - ")[1]
                    }
                }
            }).filter((e:any) =>e)
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
        }
    }
    let MenuAdministradores = [];
    /* DESDE AQUI LO HICE PARA PROBAR LAS CONEXIONES CREADAS */
    /* FIN DE LAS CONEXIONES */
    let AdminsTk: { usuarioIds: string, nombre: string }[] = [];
    AdminsTk.push({ "usuarioIds": "0", "nombre": "Todos" })
    if (DataTk)
        if (DataTk['Ticket'] != undefined) {
            DataTk['Ticket'].filter(function (item: any, index: any) {
                var nombre:string  = (item.administrador != null || item.administrador != undefined ? (item.administrador.split(" - ")[1] == undefined ? item.administrador.split(" - ")[0] : item.administrador.split(" - ")[1]):item.administrador);
                var id:string= (item.administrador != null || item.administrador != undefined ? item.administrador.split(" - ")[0]:item.administrador);
                var i = AdminsTk.findIndex(x => x.usuarioIds ==id && x.nombre == nombre);
                if (i <= -1) {
                    AdminsTk.push({ "nombre": nombre, "usuarioIds": id });
                }
                return null;
            });
        }
    MenuAdministradores = AdminsTk.map((val: any, index: any) => {
        return (
            <li key={val.nombre} className="nav-item" role="presentation">
                <button key={val.nombre} className="nav-link text-success fw-bolder" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target={`#pills-${val.usuarioIds}`} type="button" role="tab" aria-controls="pills-profile" aria-selected="false">{val.nombre}</button>
            </li>
        )
    })
    useEffect(() => {
        if (DataTk) {
            if (DataTk['Ticket'] != undefined) {
                PintarGraficas()
            }
        }
    }, [DataTk, Filtrado, DataFiltradaTk]);
    return (
        <>
            <div className="row">
                <div style={{ display: (DataTk == undefined) ? 'none' : 'inline' }} className="col-sm-12 col-xl-12 col-md-12 col-lg-12" id="txpestana">
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
                                    <table id="tablaAdminstickets w-100" className="table datatable-responsive4">
                                        <thead>
                                            <tr className="bg-teal-300">
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: (DataTk != undefined) ? 'none' : 'inline' }} className="col-sm-12 col-xl-12 col-md-12 col-lg-12 text-center" id="txpestananull">
                    <span className="font-weight-bold mb-3 text-muted" style={{ fontSize: '30px' }}>No hay datos que mostrar !!!</span>
                </div>
            </div>
        </>
    )
}
export { Tickets }