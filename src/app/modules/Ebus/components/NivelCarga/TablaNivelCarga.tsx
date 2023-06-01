import MaterialReactTable, { MRT_Cell, MRT_ColumnDef, MRT_Row, MRT_TableInstance } from "material-react-table";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { ColumnFiltersState, PaginationState, SortingState, VisibilityState } from "@tanstack/react-table";
import { TablaDTO } from "../../models/NivelcargaModels";
import { useDataNivelCarga } from "../../core/NivelCargaProvider";
import { set } from "rsuite/esm/utils/dateUtils";
import { GuardarConfiguracion, ObtenerConfiguracion } from "../../data/NivelCarga";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../setup";
import { UserModelSyscaf } from "../../../auth/models/UserModel";


// listado de columnas a visualizar por defecto
//para visibilidad de las columnas
const columnasPorDefecto = {
  "fechaString": true,
  "placa": true,
  "driver": true,
  "socInicial": true,
  "soc": true,
  "eficiencia": false,
  "autonomia": false,
  "energia": false,
  "energiaDescargada": false,
  "energiaRegenerada": false,
  "odometro": false,
  "kms": false,
  "porRegeneracion": false,
  "velocidadPromedio": false
};


type props = { tamanio: string }

//VisibilidadColumnas
const TablaNivelCarga: React.FC<props> = ({ tamanio }) => {

  const { setmarkerSeleccionado, dataTable, MinSocCarga, MaxSocCarga, VehiculosFiltrados, setDatosMapa, isExpandido, ClienteSeleccionado } = useDataNivelCarga();

  const tableInstanceRef = useRef<MRT_TableInstance<TablaDTO>>(null);
  //table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 13,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const cargarMapaIndividual = (row: any) => {
    setmarkerSeleccionado(row.original)
  };


  const [lstColumnas, setlstColumnas] = useState({});

  const [Datos, setDatos] = useState<TablaDTO[]>([])
  const [lstdirvers, setlstdirvers] = useState<any[]>([])

  useEffect(() => {
    const minSoc = MinSocCarga ?? 0;
    const maxSoc = MaxSocCarga ?? 100;
    const lstvehiculos = VehiculosFiltrados ?? [];

    if (dataTable != undefined) {
      let datos = dataTable?.filter(f => {
        const soc = f.soc ?? 0;
        return ((soc >= minSoc && soc <= maxSoc))
      })

      if (lstvehiculos.length > 0) {
        datos = datos.filter(f => {
          const vehiculos = f.placa ?? "";
          return (lstvehiculos.indexOf(vehiculos) > -1)
        })
      }

      const conductores = datos.map(m => {
        return { text: m.driver, value: m.driver }
      });
      setlstdirvers(conductores);
      setRowCount(datos.length);
      setDatos(datos);
      setDatosMapa(datos);
    }



  }, [dataTable, VehiculosFiltrados, MinSocCarga, MaxSocCarga, isExpandido])
  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );

  // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
  const model = (isAuthorized as UserModelSyscaf);

  useEffect(() => {
    if (ClienteSeleccionado?.ClienteId != "")
      ObtenerConfiguracion(model.Id, '141', '6', `${ClienteSeleccionado?.ClienteId}`).then((response: any) => {

         console.log("response", {...columnasPorDefecto, ...JSON.parse(response.data[0].Configuracion)} );
        if (response.data.length > 0) 
        setlstColumnas({...columnasPorDefecto, ...JSON.parse(response.data[0].Configuracion)} );
        
      }
      ).catch((error) => {
        console.log("error", error)
      })

  }, [ClienteSeleccionado])


  useEffect(() => {  
    if (ClienteSeleccionado?.ClienteId != "")
      GuardarConfiguracion(model.Id, '141', '6', `${ClienteSeleccionado?.ClienteId}`, JSON.stringify(lstColumnas),
        moment().format('YYYY-MM-DD HH:mm:ss')).then((response: any) => {
          console.log(response)
        }).catch((error) => { })    

  }, [lstColumnas])
  //VisibilidadColumnas

  let listadoCampos: MRT_ColumnDef<TablaDTO>[] =
    [
      {
        accessorKey: 'fechaString',
        header: 'Fecha',
        enableHiding: false,
        size: 80
      },
      {
        accessorKey: 'placa',
        header: 'Móvil',
        enableHiding: false,
        enableClickToCopy: true,
        Cell({ cell, column, row, table, }) {
          return (cell.getValue() != null) ? <a style={{ cursor: 'pointer' }}
            data-rel={row.original.placa} href="#" id="MapaIndividual" onClick={() => { cargarMapaIndividual(row) }}
            className="MapaIndividual"> {(row.original.placa == null ? "" : row.original.placa)}</a> : "";
        }
      },
      {
        accessorKey: 'driver',
        header: 'Operador',
        filterVariant: 'select',
        filterSelectOptions: lstdirvers,
        enableHiding: false,
        size: 180
      },
      {
        accessorKey: 'socInicial',
        header: 'SOC Ini [%]',
        Cell({ cell, column, row, table, }) {
          return (getIconSoc(row.original.socInicial));
        },
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        enableHiding: false
      },
      {
        accessorKey: 'soc',
        header: 'SOC [%]',
        Cell({ cell, column, row, table, }) {
          return (getIconSoc(row.original.soc));
        },
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        enableHiding: false
      },
      {
        accessorKey: 'kms',
        header: 'Distancia',
        Header: <span>Distancia <br />[km]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.kms?.toFixed(1));
        }
      },
      {
        accessorKey: 'eficiencia',
        header: `Eficiencia`,
        Header: <span>Eficiencia<br />[km/kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.eficiencia?.toFixed(1));
        }
      },
      {
        accessorKey: 'porRegeneracion',
        header: 'Regeneración',
        Header: <span>Regeneración<br />[%]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.porRegeneracion?.toFixed(1));
        }
      },
      {
        accessorKey: 'autonomia',
        header: 'Autonomia',
        Header: <span>Autonomia<br /> [Km]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.autonomia?.toFixed(1));
        }
      },
      {
        accessorKey: 'energia',
        header: 'Energia',
        Header: <span>Energía<br /> [kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energia?.toFixed(1));
        }
      },
      {
        accessorKey: 'energiaDescargada',
        header: 'Energia descargada',
        Header: <span>E.Descargada<br /> [kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energiaDescargada?.toFixed(1));
        }
      },
      {
        accessorKey: 'energiaRegenerada',
        header: 'E.Regenerada',
        Header: <span>E.Regenerada<br /> [kWh]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.energiaRegenerada?.toFixed(1));
        }
      },
      {
        accessorKey: 'odometro',
        header: 'Odómetro',
        Header: <span>Odómetro<br /> [km]</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.odometro?.toFixed(1));
        }
      },
      {
        accessorKey: 'velocidadPromedio',
        header: 'Velocidad',
        Header: <span>Velocidad<br /> Prom</span>,
        Cell({ cell, column, row, table, }) {
          return (row.original.velocidadPromedio?.toFixed(1));
        }
      }
    ];





  //funcion para retornar los iconos de la tabla de soc y soc inicial
  const getIconSoc = (data: any) => {
    return (
      (data <= 100 && data >= 80) ? <><i className="bi-battery-full" style={{ color: '#00B050' }}></i><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
        data <= 79 && data >= 60 ? <><i className="bi-battery-full rotate-45-verde" style={{ color: '#92D050' }}></i><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
          (data <= 59 && data >= 40 ? <><span><i className="bi-battery-half rotate-45-yellow" style={{ fontSize: "15px", color: '#ff0' }}></i></span><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
            (data <= 39 && data >= 20 ? <><span><i className="bi-battery-half rotate-45-naranja" style={{ color: '#ffa500' }}></i></span><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
              (data <= 19 && data >= 0 ? <><span><i className="bi-battery-half" ></i></span><span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></> :
                <><span><i className="bi-battery-half"></i></span> <span style={{ fontSize: "15px" }}>{data == null ? "" : data.toFixed(0)}%</span></>)))
    );
  }

  //retorna la tabla
  return (


    <MaterialReactTable

      localization={MRT_Localization_ES}
      enableColumnFilters={false}
      enableColumnOrdering
      enableColumnDragging={false}
      enablePagination={false}
      enableStickyHeader
      enableStickyFooter
      enableDensityToggle={false}
      enableRowVirtualization
      enableTableFooter

      muiTableContainerProps={{
        sx: { maxHeight: '600px', scrollbarColor: 'primary' }, //give the table a max height

      }}
      displayColumnDefOptions={{
        'mrt-row-actions': {
          muiTableHeadCellProps: {
            align: 'left',
          },
          size: 3,
        },
      }
      }
      muiTableHeadCellProps={{
        sx: (theme) => ({
          fontSize: 11,
          fontStyle: 'bold',
          color: 'rgb(27, 66, 94)'

        }),
      }}
      columns={listadoCampos}
      data={Datos}
      enableTopToolbar={true}
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={rowCount}
      enableFilters
      globalFilterFn="Filter" //set the global filter function to myCustomFilterFn
      muiToolbarAlertBannerProps={
        isError
          ? {
            color: 'error',
            children: 'Error al cargar información',
          }
          : undefined
      }
      defaultColumn={{
        minSize: 10, //allow columns to get smaller than default
        maxSize: 300, //allow columns to get larger than default
        size: 50,
      }}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isRefetching,
        sorting,
        columnVisibility: lstColumnas
      }}
      initialState={{ columnVisibility: columnasPorDefecto, showColumnFilters: true, density: 'compact' }}
      tableInstanceRef={tableInstanceRef}
      onColumnVisibilityChange={setlstColumnas}


    />



  )

}

export { TablaNivelCarga };
