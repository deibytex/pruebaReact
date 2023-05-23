import Chart, { ChartConfiguration, ChartDataSets } from "chart.js";
import { useEffect, useState } from "react";
import { getCSSVariableValue } from "../../../../../_start/assets/ts/_utils";
import { useDataDashboard } from "../../core/DashboardProvider";
import ReactApexChart from "react-apexcharts";

type Props = {
    className: string;
}
const VerticalChart: React.FC<Props> = ({ className }) => {
    const { Data, DataFiltrada, Filtrado } = useDataDashboard();
    const [Vertical, setVertical] = useState<any>(null);
    useEffect(() => {
        let opciones = {
            options: {
                chart: {
                    id: 'apexchart-vertical',
                }
            },
            series: [],
            dataLabels: {
                enabled: false
            },
            xaxis: {
                type: 'category'
            }
        }
        setVertical(opciones);
        return function cleanUp() {
            //SE DEBE DESTRUIR EL OBJETO CHART
        };
    }, [])

    //Para los datos
    const RetornarSerie = (data: any[]) => {
        if (data == null || data == undefined)
            return false;

        //agrupador general o fecha.
        let agrupadorGeneral = data.map((item) => {
            if(item.ClasificacionId == "Si")
                return item.Vertical;
        }).filter((value, index, self: any) => {
            return self.indexOf(value) === index;
        });

        //Para los datos de la grafica principal
        let Datos = new Array();
        //Agrupador por color.
        let Semana = data.map((item) => {
            return item.Fecha;
        }).filter((value, index, self: any) => {
            return self.indexOf(value) === index;
        });

        let arrayEstados = new Array();
        // filtramos por los clientes para obtener la agrupacion por  estado
        agrupadorGeneral.map(function (item) {
            if(item != undefined){
                Semana.map(function (itemSemana) {
                    let filtroEstado = data.filter(function (val, index) {
                        return (val.Fecha == itemSemana && val.Vertical == item);
                    });
                    arrayEstados.push([{
                        x: item,
                        y: filtroEstado.length
                    }]);
                });
            }
        });

        ApexCharts.exec('apexchart-vertical', 'updateOptions', {
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
        ApexCharts.exec('apexchart-vertical', 'updateOptions', {
            // Para los nombres de la serie
            //para que la lengenda me salga en la parte de abajo
            labels: agrupadorGeneral,
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
            ApexCharts.exec('apexchart-vertical', 'updateSeries',
                [
                    {
                        name: [...Semana],
                        data: arrayEstados.map((val) => {
                            return val[0].y;
                        })
                    }
                ]
            );

    };
    //el use effect
    useEffect(() => {
        if (Filtrado) {
            if (DataFiltrada)
                if (DataFiltrada != undefined) {
                   RetornarSerie(DataFiltrada.filter(function (item: any) {
                        return ( item.ClasificacionId == "Si" ?? item.Vertical );
                    }))
                }
        }
        else {
            if (Data)
                if (Data['Unidades'] != undefined) {
                     RetornarSerie(Data['Unidades'].filter(function (item: any) {
                        return ( item.ClasificacionId == "Si" ?? item.Vertical );
                    }))
                }
        }
    }, [Data, DataFiltrada, Filtrado])
    return (
        <>
            <div className={className}>
                <div className="text-center pt-5">
                    <label className="label label-sm fw-bolder">VERTICAL</label>
                </div>
                {
                    (Vertical != null) && (Vertical.options != undefined) && (<ReactApexChart options={Vertical.options} series={Vertical.series} type="bar" height={300} />)
                }
            </div>

        </>
    )
}
export { VerticalChart }