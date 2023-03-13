import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDataEventoCarga } from "../../core/EventoCargaProvider";
import { TablaDTO } from "../../models/EventoCargaModels";


const  TablaEventoCarga : React.FC = () =>{
     //table state
     const [Datos, setDatos] = useState<TablaDTO[]>([]);
     const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
     const [globalFilter, setGlobalFilter] = useState('');
     const [sorting, setSorting] = useState<SortingState>([]);
     const [pagination, setPagination] = useState<PaginationState>({
       pageIndex: 0,
       pageSize: 15,
     });
     const [rowCount, setRowCount] = useState(0);
     const [isLoading, setIsLoading] = useState(false);
     const [isRefetching, setIsRefetching] = useState(false);
     const [isError, setIsError] = useState(false);
     const [alarmas, setalarmas] = useState([90, 95]);
     const { dataTable,  VehiculosFiltrados, MinSocCarga, MaxSocCarga } = useDataEventoCarga();


useEffect(() =>{


  const minSoc = MinSocCarga ?? 0;
  const maxSoc = MaxSocCarga ?? 100;
  const lstvehiculos  = VehiculosFiltrados ?? [];

 
  if(dataTable != undefined) {
    let datos =  dataTable?.filter(f => {
        const soc = f.soc;
     
        return (( soc>=minSoc && soc <= maxSoc ) )
    })

    if(lstvehiculos.length > 0)
    {
      datos =datos.filter(f => {
       
        const vehiculos = f.placa;
        return (lstvehiculos.indexOf(vehiculos) > -1 )
    })
    }
    setRowCount(datos.length);


    setDatos(datos);
    console.log(datos,minSoc , maxSoc, lstvehiculos )

  }

},[dataTable, VehiculosFiltrados, MinSocCarga, MaxSocCarga])

//para visibilidad de las columnas
let VisibilidadColumnas = { 
    totalTime:true,
    energia:true,
    odometro:false, 
    potencia:false,
    potenciaProm:false
    
  }; 
     let listadoCampos: MRT_ColumnDef<TablaDTO>[] =

     [
        {
            accessorKey:'isDisconected',
            header: 'Estado',
            enableHiding: false,
            Cell({ cell, column, row, table, }) {
                return <><div title={(row.original.isDisconected == 1 || row.original.isDisconected == null) ? 'Desconectado':'Conectado'} style={{textAlign:'center'}}><i className="bi-battery-charging" style={{fontSize:'18px', color:`${(row.original.isDisconected == 1 || row.original.isDisconected == null) ? 'red' : 'green'}`}}></i></div></>;
            },
            size: 2,
            minSize: 5, //min size enforced during resizing
            maxSize: 5,
        },
        {
            accessorKey:'ubicacion',
            header: 'Ubicacion',
            Cell({ cell, column, row, table, }) {
                return (row.original.ubicacion == null  ? 'No Especificado': row.original.ubicacion);
            },
            enableHiding: false,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
        },
        {
            accessorKey: 'fecha',
            header: 'Fecha',
            enableHiding: false,
            size: 10,
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
            Cell({ cell, column, row, table, }) {
            return (moment(row.original.fecha).format("DD/MM/YYYY"));
            }
        },
        {
            accessorKey: 'placa',
            header: 'Móvil',
            enableHiding: false,
            enableClickToCopy:true,
            filterFn:'contains',
            minSize: 10, //min size enforced during resizing
            maxSize: 10,
            size: 10
        },
        {
            accessorKey: 'socInicial',
            header: 'SOC Ini [%]',
            Cell({ cell, column, row, table, }) {
            return (getIconSoc(row.original.socInicial)) ;
            },
            enableHiding: false,
            minSize: 5, //min size enforced during resizing
            maxSize: 5,
            size: 5
       },
       {
            accessorKey: 'fechaString',
            header: 'Inicio carga',
            enableHiding: false,
            minSize: 5, //min size enforced during resizing
            maxSize: 5,
            size: 5
       },
       {
            accessorKey: 'soc',
            header: 'SOC [%]',
            Cell({ cell, column, row, table, }) {
            return (getIconSoc(row.original.soc)) ;
            },
            enableHiding: false,
            minSize: 5, //min size enforced during resizing
            maxSize: 5,
            size: 5
       },
       {
            accessorKey: 'totalTime',
            header: 'Tiempo carga',
            minSize: 5, //min size enforced during resizing
            maxSize: 5,
            size: 5
      },
        {
            accessorKey: 'energia',
            header: 'Energia',
            Header:<span>Energía<br/> [kWh]</span>,
            Cell({ cell, column, row, table, }) {
            return (row.original.energia?.toFixed(2)) ;
            },
            size: 20
        },
      {
            accessorKey: 'odometer',
            header: 'Odometro',
            Header:<span>Odometro<br/> [kWh]</span>,
            Cell({ cell, column, row, table, }) {
            return (row.original.odometer?.toFixed(2)) ;
            },
            size: 20
        },
      {
            accessorKey: 'potencia',
            header: 'Potencia',
            Header:<span>Potencia Inst<br/> [kWh]</span>,
            Cell({ cell, column, row, table, }) {
            return (row.original.potencia?.toFixed(2)) ;
            },
            size: 20
      },
       {
            accessorKey: 'potenciaProm',
            header: 'Potencia promedio',
            Header: <span>Potencia<br/> Prom</span>,
            Cell({ cell, column, row, table, }) {
            return (row.original.potenciaProm?.toFixed(2)) ;
            },
            size: 10
       }
      ];

     //funcion para retornar los iconos de la tabla de soc y soc inicial
const getIconSoc = (data:any) => {
    return (
      (data <= 100 && data >= 80)? <><i className="bi-battery-full" style={{ color:'#00B050'}}></i><span style={{fontSize:"12px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
       data <= 79 && data >= 60 ? <><i className="bi-battery-full" style={{color:'#92D050'}}></i><span style={{fontSize:"12px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
      (data <= 59 && data >= 40 ? <><span><i className="bi-battery-half" style={{color:'#CCED63'}}></i></span><span style={{fontSize:"12px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
      (data <= 39 && data >= 20 ? <><span><i className="bi-battery-half" style={{color:'#ffa500'}}></i></span><span style={{fontSize:"12px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
      (data <= 19 && data >= 0 ? <><span><i className="bi-battery-half" style={{color:'red'}} ></i></span><span style={{fontSize:"12px"}}>{data == null ? "" : data.toFixed(0)}%</span></>:
      <><span><i className="bi-battery-half"></i></span> <span style={{fontSize:"12px"}}>{data == null ? "" : data.toFixed(0)}%</span></>)))
    );
}
    // fin table state
    return (
        <><MaterialReactTable
        localization={MRT_Localization_ES}
        displayColumnDefOptions={{
        'mrt-row-actions': {
            muiTableHeadCellProps: {
            align: 'center',
            },
            size: 3,
        },
      }
      }
      muiTableHeadCellProps={{
        sx: (theme) => ({
          fontSize : 14,
          fontStyle: 'bold',  
        color: 'rgb(27, 66, 94)'
        
      }),
    }}
        columns={listadoCampos}
        data={Datos}
        enableTopToolbar={true}
        enableDensityToggle
        enableColumnOrdering
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount}
        enableFilters
        enableColumnFilters={false}
        globalFilterFn="Filter" //set the global filter function to myCustomFilterFn
        muiToolbarAlertBannerProps={
          isError
            ? {
              color: 'error',
              children: 'Error al cargar información',
            }
            : undefined
        }
        state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isRefetching,
        sorting,
        }}
        initialState={{showColumnFilters: true, density: 'compact', columnVisibility:VisibilidadColumnas,}}
    /> </>
    )
}
export {TablaEventoCarga}