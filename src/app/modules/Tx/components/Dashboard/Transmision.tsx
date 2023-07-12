import MaterialReactTable, { MRT_ColumnDef} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import {  useEffect, useRef, useState } from "react";
import { useDataDashboard } from "../../core/DashboardProvider";
import { TablaClientesTxDTO } from "../../models/DasboardModels";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

const Transmision: React.FC = () =>{
    const {DataTx, DataFiltradaTx, FiltradoTx,DataAcumulado, setFiltradoTx, setDataFiltradaTx} = useDataDashboard()
    const [DataTxAdmin, setDataTxAdmin] = useState<any[]>([]);
    const [PlacaSinTx, setPlacaSinTx] = useState<string>("0");
    const [ClienteSinTx, setClienteSinTx] = useState<string>("0");
   let MenuAdministradoresTransmision: JSX.Element[] | undefined = []

//table state
const tableContainerRef = useRef<HTMLDivElement>(null);
const [rowCount1, setRowCount1] = useState(0);
const [rowCount2, setRowCount2] = useState(0);
const [Scatter, setScatter] = useState<any>(null);
const [VerticalTx, setVerticalTx] = useState<any>(null);
    //decimal de miles
    const format = (num:number) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
   
    useEffect(() => {
       
     
    if(FiltradoTx){
         setRowCount2((DataFiltradaTx != undefined ? DataFiltradaTx.length:0 ));
        if(DataFiltradaTx){
            if (DataFiltradaTx != undefined){
                DataFiltradaTx.filter(function (item:any,index:any) {
                    var i = AdminsTransmision.findIndex(x => (x.usuarioIds == item.usuarioId && x.nombre == item.Usuario));
                    if (i <= -1) {
                        AdminsTransmision.push({"nombre":item.Usuario,"usuarioIds":item.usuarioId });
                    }
                    return null;
                });
                // Para el listado de tabla de los clientes
                let DataAdmins =DataFiltradaTx.reduce((acc:any,obj:any) =>{
                    let key = obj['clientenNombre'];
                    if (!acc[key]) {
                        acc[key] = []
                    }
                    acc[key].push(obj)
                    return acc
                },{});
                let Clientes:TablaClientesTxDTO[] = [];
                Object.values(DataAdmins).map((value:any,index:any ) =>{
                    Clientes.push({
                        "clientenNombre": Object.entries(DataAdmins)[index][0] , "DiasSinTx": value.length
                    });
                })
            
                setDataTxAdmin(Clientes);
                setRowCount1((Clientes != undefined ? Clientes.length:0 ));

                //La etiqueta de las placas totales sin TX
                let _temp = 0;
                DataFiltradaTx.map((value:any)=>{
                    _temp = _temp + value.DiasSinTx;

                })
                let ClienteSinTx = 0;
                Clientes.map((val:any) =>{
                    ClienteSinTx = ClienteSinTx + val.DiasSinTx;
                });
                setPlacaSinTx(format(_temp));
                setClienteSinTx(format(ClienteSinTx));
            }
        }
    }else{
        setRowCount2((DataTx != undefined && DataTx['Transmision'] != undefined ? DataTx['Transmision'].length:0 ));
            if(DataTx){
                if (DataTx['Transmision'] != undefined){
                    DataTx['Transmision'].filter(function (item:any,index:any) {
                        var i = AdminsTransmision.findIndex(x => (x.usuarioIds == item.usuarioId && x.nombre == item.Usuario));
                        if (i <= -1) {
                            AdminsTransmision.push({"nombre":item.Usuario,"usuarioIds":item.usuarioId });
                        }
                        return null;
                    });
                    // Para el listado de tabla de los clientes
                    let DataAdmins = DataTx['Transmision'].reduce((acc:any,obj:any) =>{
                        let key = obj['clientenNombre'];
                        if (!acc[key]) {
                            acc[key] = []
                        }
                        acc[key].push(obj)
                        return acc
                    },{});
                    let Clientes:TablaClientesTxDTO[] = [];
                    Object.values(DataAdmins).map((value:any,index:any ) =>{
                        Clientes.push({
                            "clientenNombre": Object.entries(DataAdmins)[index][0] , "DiasSinTx": value.length
                        });
                    })
                
                    setDataTxAdmin(Clientes);
                    setRowCount1((Clientes != undefined ? Clientes.length:0 ));

                    //La etiqueta de las placas totales sin TX
                    let _temp = 0;
                    DataTx['Transmision'].map((value:any)=>{
                        _temp = _temp + value.DiasSinTx;

                    })
                    let ClienteSinTx = 0;
                    Clientes.map((val:any) =>{
                        ClienteSinTx = ClienteSinTx + val.DiasSinTx;
                    });
                    setPlacaSinTx(format(_temp));
                    setClienteSinTx(format(ClienteSinTx));
                }
            }
        }   
        return () =>{
            setDataTxAdmin([]);
            setRowCount1(0);
            setRowCount2(0);

        }
}, [DataTx, DataFiltradaTx, FiltradoTx]);
   
    let AdminsTransmision:{usuarioIds:string, nombre:string} []= [];
    AdminsTransmision.push({"usuarioIds":"0","nombre":"Todos"})
    if(DataTx)
    if (DataTx['Transmision'] != undefined){
        DataTx['Transmision'].filter(function (item:any,index:any) {
             var i = AdminsTransmision.findIndex(x => (x.usuarioIds == item.usuarioId && x.nombre == item.Usuario));
             if (i <= -1) {
                AdminsTransmision.push({"nombre":item.Usuario,"usuarioIds":item.usuarioId });
             }
             return null;
         });
        // setRowCount(DataTx['Transmision'].length);
     }

     const FiltrarByAdminsTx = (event:any) =>{
        let Usuario:string = event.target.attributes['data-bs-target'].value.split("--")[1];
        switch(Usuario) {
            case '0':
                setFiltradoTx(false);
                break;
            default:
                setFiltradoTx( true);
                if(DataTx != undefined){
                    let DataResulttx = DataTx['Transmision'].filter((val:any) =>{
                        return (val.usuarioId == Usuario)
                    });
                    setDataFiltradaTx(DataResulttx);
                }
                 break;
          }
     }
     MenuAdministradoresTransmision = AdminsTransmision?.map((val:any,index:any) =>{
        return (
            <li key={val.nombre} className="nav-item" role="presentation">
                <button key={val.nombre} onClick={FiltrarByAdminsTx} className={`nav-link text-success ${(index == 0 ? 'active':'')} fw-bolder`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target={`#pills--${val.usuarioIds}`} type="button" role="tab" aria-controls="pills-profile" aria-selected="false">{val.nombre}</button>
            </li>
        )
    });

    let listadoCamposTablaClientes: MRT_ColumnDef<any>[] =

     [
            {
            accessorKey: 'clientenNombre',
            header: 'Cliente',
            id: 'clientenNombre',
          },
          {
            accessorKey: 'DiasSinTx',
            header: 'Cant sin Tx',
            id: 'DiasSinTx',
          }
     ]
     let listadoCamposTabla2: MRT_ColumnDef<any>[] =

     [
        {
            accessorKey: 'clientenNombre',
            header: 'Cliente',
            maxSize: 10,
          },{
            accessorKey: 'registrationNumber',
            header: 'Placa',
            maxSize: 10,
          },
          {
            accessorKey: 'DiasSinTx',
            header: 'Dias sin Tx',
            maxSize: 10,
          }
     ]
    
     useEffect(()=>{
        let opcionScatter = {
            options: {
                chart: {
                    id: 'apexchart-scatter',
                    zoom: {
                        enabled: true,
                        type: 'xy'
                      }
                },
                grid: {
                    xaxis: {
                      lines: {
                        show: true
                      }
                    },
                    yaxis: {
                      lines: {
                        show: true
                      }
                    },
                  },
                xaxis: {
                    type: 'category',
                  },
                  yaxis: {
                    tickAmount: 7
                  }
            },
            series: [{"name":"","data":[{x:"0",y:0}]}],
            dataLabels: {
              enabled: false
            }
        }
        setScatter(opcionScatter)
        //Para las verticales
        let opcionesVertical = {
            options: {
                chart: {
                    id: 'apexchart-verticalTX',
                    stacked: true,
                    toolbar: {
                        show: false
                      },
                },
            },
            series: [],
            dataLabels: {
                enabled: false
            },
            xaxis: {
                type: 'category'
            }, 
            fill: {
                opacity: 1
              },
              legend: {
                position: 'right',
                offsetX: 0,
                offsetY: 50
              },
        }
        setVerticalTx(opcionesVertical);
     },[])
//funcion que llena la grafica de los clientes
     const DatosClientes = (data:any[]) =>{
  //BARRAS
         //agrupador general o fecha.
         let agrupadorGeneral = data.map((item) => {
            return item.clientenNombre;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });
        let DatosFinales = new Array();
        let arrayEstados = new Array();
        //Agrupador por color.
        let agrupadorData = data.map((item) => {
            return item.Estado;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });

      
        // filtramos por los clientes para obtener la agrupacion por  estado
        agrupadorGeneral.map(function (item) {
            agrupadorData.map(function (itemEstados) {
                let filtroEstado = data.filter(function (data, index) {
                    return (data.Estado == itemEstados && data.clientenNombre == item);
                });

                arrayEstados.push([itemEstados, filtroEstado.length]);
            });

        });

        agrupadorData.map(function (itemEstados) {
            let filtroEstado = arrayEstados.filter(function (data, index) {
                return data[0] == itemEstados;
            }).map(function (x) {
                return x[1];
            });;
    
            DatosFinales.push({"name":itemEstados,"data":[...filtroEstado]} );
        });
    



        ApexCharts.exec('apexchart-verticalTX', 'updateOptions', {
            chart: {
                fill: {
                    colors:  ['#c49c94',  '#f7b6d2',  '#bcbd22', '#dbdb8d', '#17becf', '#9edae5','#e377c2',] //'#7f7f7f', '#c7c7c7',
                },
                toolbar: {
                    show: true
                },

            }, 
            // xaxis: {
            //     categories: agrupadorGeneral.filter((e) => e)
            // },
            colors: [ '#c49c94', '#f7b6d2', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5','#e377c2',],//,'#7f7f7f', '#c7c7c7',
        }
        );
        let labels  = agrupadorGeneral.map((e) =>{ 
            if(e.length > 15){
                let cadena = `${e.substr(0,15)}...`
                return cadena.trim()
            }else
            return e.trim();
            
        });
        ApexCharts.exec('apexchart-verticalTX', 'updateOptions', {
            // Para los nombres de la serie
            //para que la lengenda me salga en la parte de abajo
            labels: labels,
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
                    horizontal: false
                }
            }
        });
            // actializar los datos
            ApexCharts.exec('apexchart-verticalTX', 'updateSeries',
            DatosFinales
            );
     }
     const RetornarSerie = (data:any[]) => {
        var dataChart = data;
        //Para los datos de la grafica principal
        let Datos = new Array();
        let retornarDatos = new Array();
        //Agrupador por color.
        let Usuarios = dataChart.map((item) => {
            return item.Usuario;
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });
        let Fechas =  data.map((item) => {
            return item["Fecha"];
        }).filter((value, index, self:any) =>{
            return self.indexOf(value) === index;
        });
        let totalAdmon:any =[]
        Usuarios.map((Usuario) =>{
            Fechas.forEach(Fecha => {
                if(Usuario != undefined){
                    let datamarter = data.filter(function (val) {
                        if (moment(val.Fecha).format("DD/MM/YYYY")  == moment(Fecha).format("DD/MM/YYYY") ){
                            if(Usuario == val.Usuario ){
                                return val.Fecha
                            }
                        }
                    }).length;
                    Datos.push({"name":Usuario,"data":[{x: moment(Fecha).format("DD/MM/YYYY").toString(),y:datamarter}]});
                }
            });
         
        })
        let nuevoObjeto = {}
        //Recorremos el arreglo 
        Datos.forEach( x => {
        //Si la ciudad no existe en nuevoObjeto entonces
        //la creamos e inicializamos el arreglo de profesionales. 
        if( !nuevoObjeto.hasOwnProperty(x.name)){
            nuevoObjeto[x.name] = {
            data: []
            }
        }
        
        //Agregamos los datos de profesionales. 
            nuevoObjeto[x.name].data.push({
            x: x.data[0].x,
            y: x.data[0].y
            })
        
        })
        let Data:any = [];
        Object.keys(nuevoObjeto).forEach((val, index) =>{
            Data.push({"name":val,"data":[...nuevoObjeto[val].data]})
        })
        
        var hash = {};
        Data = Data.filter(function(current:any) {
            var exists = !hash[current.name];
            hash[current.name] = true;
            return exists;
          });
        
                // ApexCharts.exec('apexchart-scatter', 'updateOptions', {
        //     // Para los nombres de la serie
        //     //para que la lengenda me salga en la parte de abajo
        //     labels: agrupadorData.filter((e) => e),
        // });
            // actializar los datos
        ApexCharts.exec('apexchart-scatter', 'updateSeries', Data);


      
    };
    useEffect(() => {
        if(FiltradoTx){
            let dataFiltrada:any[] =[] 
            if(DataFiltradaTx){
                if(DataFiltradaTx != undefined){
                    RetornarSerie(DataFiltradaTx.filter(function (item:any) {
                         return item.Usuario;
                 }))
                 DatosClientes(DataFiltradaTx.filter(function (item:any) {
                        return item.Usuario;
                }))
             }
            }
            }
        else
        {
            let timerId = setTimeout(() => {
            if(DataAcumulado != undefined && DataAcumulado.length){
                RetornarSerie(DataAcumulado.filter(function (item:any) {
                    return item.Usuario;
                }))
            }
            if(DataTx != undefined  && DataTx.length != 0){
                DatosClientes(DataTx["Transmision"]);
            }
            clearTimeout(timerId);
            }, 1000);
        }
    },[DataAcumulado, FiltradoTx,DataFiltradaTx, DataTx ])

    return(
        <>
            <div className="row">
                <div  style={{display: (DataTx == undefined) ? 'none':'inline'}}  className="col-sm-12 col-xl-12 col-md-12 col-lg-12" id="txpestana">
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        {
                            (MenuAdministradoresTransmision.length != 0) && ( [...MenuAdministradoresTransmision])
                        }
                </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active border" id="rep_assets_lst_admon_detalle_tx">
                            <div className="row">
                                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 ">
                                    <div className="text-center"><span id="EstadoCantidad" style={{fontSize:'26px'}}></span></div>
                                </div>
                                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                {
                                    (Scatter != null) && (Scatter.options != undefined) && (<ReactApexChart options={Scatter.options} series={Scatter.series} type="scatter" height={300} />)
                                }
                                    {/* {(DataTx !=  undefined) &&(DataTx['Transmision'] !=  undefined) && (<TransmisionScatterChart className={"shadow-lg"}></TransmisionScatterChart>)} */}
                                    
                                </div>
                                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                {
                                    (VerticalTx != null) && (VerticalTx.options != undefined) && (<ReactApexChart options={VerticalTx.options} series={VerticalTx.series} type="bar" height={300} />)
                                }
                                    {/* {(DataTx !=  undefined) &&(DataTx['Transmision'] !=  undefined) && (<TransmisionBarChart className={"shadow-lg"}></TransmisionBarChart>)} */}
                                    
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-5">
                                    {(DataTx !=  undefined) &&(DataTx['Transmision'] !=  undefined) && (    <MaterialReactTable
                                    localization={MRT_Localization_ES}
                                    muiTableContainerProps={{
                                        sx: { maxHeight: '400px' }, //give the table a max height
                                      }}
                                    columns={listadoCamposTablaClientes}
                                    data={(DataTxAdmin != undefined ? DataTxAdmin: [])}
                                    enableTopToolbar={true}
                                    enableDensityToggle
                                    rowCount={rowCount1}
                                    enablePagination={false}
                                    initialState={{density: 'compact'}}
                                    enableStickyHeader
                                    enableStickyFooter
                                    />)}
                            
                                     <div className="container">
                                        <div className="row">
                                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                                <span className="fw-bolder">Total</span>
                                            </div>
                                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                                <span className="fw-bolder text-rigth">{ClienteSinTx}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-5">
                                    {(DataTx !=  undefined) &&(DataTx['Transmision'] !=  undefined) && (<MaterialReactTable
                                    localization={MRT_Localization_ES}
                                    muiTableContainerProps={{
                                        ref: tableContainerRef, //get access to the table container element
                                        sx: { maxHeight: '400px' }, //give the table a max height
                                      }}
                                    columns={listadoCamposTabla2}
                                    data={( FiltradoTx ? DataFiltradaTx :(DataTx != undefined ? DataTx['Transmision'] : []))}
                                    enableDensityToggle
                                    enableFilters
                                    enablePagination={false}
                                    initialState={{density: 'compact'}}
                                    enableStickyHeader
                                    enableStickyFooter
                                    />)}
                                
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                                <span className="fw-bolder">Total</span>
                                            </div>
                                            <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">

                                            </div>
                                            <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                                                    <span className="fw-bolder text-center">{PlacaSinTx}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: (DataTx != undefined) ? 'none':'inline'}} className="col-sm-12 col-xl-12 col-md-12 col-lg-12 text-center" id="txpestananull">
                    <span className="font-weight-bold mb-3 text-muted" style={{fontSize:'30px'}}>No hay datos que mostrar !!!</span>
                </div>
            </div>
        </>
    )
}
export {Transmision}