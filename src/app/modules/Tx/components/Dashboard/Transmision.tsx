
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import {  useEffect, useRef, useState } from "react";
import { useDataDashboard } from "../../core/DashboardProvider";
import { TablaClientesTxDTO } from "../../models/DasboardModels";
import { TransmisionScatterChart } from "./TransmisionScatterChart";
import { TransmisionBarChart } from "./TransmisionBarChart";

const Transmision: React.FC = () =>{
    const {DataTx, Clientes, ClienteSeleccionado, setData, DataFiltradaTx, FiltradoTx, setFiltradoTx, setDataFiltradaTx} = useDataDashboard()
    const [DataTxAdmin, setDataTxAdmin] = useState<any[]>([]);
    const [PlacaSinTx, setPlacaSinTx] = useState<string>("0");
    const [ClienteSinTx, setClienteSinTx] = useState<string>("0");
   let MenuAdministradoresTransmision: JSX.Element[] | undefined = []

//table state
const tableContainerRef = useRef<HTMLDivElement>(null);
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
const [globalFilter, setGlobalFilter] = useState('');
const [sorting, setSorting] = useState<SortingState>([]);
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: -1,
});
const [rowCount1, setRowCount1] = useState(0);
const [rowCount2, setRowCount2] = useState(0);
const [isLoading, setIsLoading] = useState(false);
const [isRefetching, setIsRefetching] = useState(false);
const [isError, setIsError] = useState(false);

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
            header: 'Dias sin Tx',
            id: 'DiasSinTx',
          }
     ]
     let listadoCamposTabla2: MRT_ColumnDef<any>[] =

     [
            {
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
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    {(DataTx !=  undefined) &&(DataTx['Transmision'] !=  undefined) && (<TransmisionScatterChart className={"shadow-lg"}></TransmisionScatterChart>)}
                                    
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    {(DataTx !=  undefined) &&(DataTx['Transmision'] !=  undefined) && (<TransmisionBarChart className={"shadow-lg"}></TransmisionBarChart>)}
                                    
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
                                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                                <span className="fw-bolder">Total</span>
                                            </div>
                                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                                    <span className="fw-bolder text-rigth">{PlacaSinTx}</span>
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