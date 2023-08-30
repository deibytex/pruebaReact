import BlockUi from "@availity/block-ui";
import { Box, IconButton, Tooltip } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import { MRT_Localization_ES } from "material-react-table/locales/es"
import moment from "moment";
import { useEffect, useState } from "react";

//import { useEffect, useRef, useState } from "react";
import { Check } from "react-feather";
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";

import { useDataReporte } from "../../core/ReporteProvider";
import { GetEstadosTransmision, GetInformeTransmision, SetEstadoSyscaf } from "../../data/Reporte";
import { TablaDTO } from "../../models/ReporteModels";

const TableReporte: React.FC = () => {
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const { ClienteSeleccionado, Data, setData, DataFiltrada, setDataFiltrada } = useDataReporte();
  const { setCargando, Cargando, Filtrado, setFiltrado } = useDataReporte();
  const [DataLocal, setDatalocal] = useState<TablaDTO[]>((Data ? Data : []));
  const [Estados, setEstados] = useState<any[]>([]);
  const TipoIds = "3";
  let VisibleDefault = {
    assetCodigo: false,
    Cliente: true,
    Sitio: true,
    registrationNumber: true,
    AVL: false,
    diffAVL: true,
    nombre: true,
    assetId: false,
    estadoSyscaf: true
  }
  let listadoCampos: MRT_ColumnDef<TablaDTO>[] =

    [
      {
        accessorKey: 'accion',
        header: 'Acciones',
        Cell({ cell, column, row, table, }) {
          return <div className="">{PintarIconosMenu(row.original.assetId)}</div>
        },
        size: 15,
        minSize: 15, //min size enforced during resizing
        maxSize: 15,
      },
      {
        accessorKey: 'assetCodigo',
        header: 'Id',
        enableHiding: true,
        size: 10,
        minSize: 10, //min size enforced during resizing
        maxSize: 10,
      },
      {
        accessorKey: 'Cliente',
        header: 'Cliente',
        enableHiding: false,
        size: 10,
        minSize: 10, //min size enforced during resizing
        maxSize: 10,

      },
      {
        accessorKey: 'Sitio',
        header: 'Sitio',
        enableHiding: true,
        size: 10,
        minSize: 10, //min size enforced during resizing
        maxSize: 10,

      },
      {
        accessorKey: 'registrationNumber',
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
        accessorKey: 'diffAVL',
        header: 'Días sin TX',
        enableHiding: true,
        size: 5,
        minSize: 5, //min size enforced during resizing
        maxSize: 5,
      },
      {
        accessorKey: 'nombre',
        header: 'Administrador',
        enableHiding: false,
        size: 10,
        minSize: 10, //min size enforced during resizing
        maxSize: 10,

      },
      {
        accessorKey: 'assetId',
        header: 'ID',
        enableHiding: true,
        size: 10,
        minSize: 10, //min size enforced during resizing
        maxSize: 10,

      },
      {
        accessorKey: 'estadoSyscaf',
        header: 'Estado',
        enableHiding: false,
        size: 10,
        minSize: 10, //min size enforced during resizing
        maxSize: 10,
        Cell({ cell, column, row, table, }) {
          return <span className={`badge bg-${RetornarEstado(row.original.estadoSyscaf)}`}>{row.original.estadoSyscaf}</span>;
        }
      }
    ]

  const RetornarEstado = (Estado: string) => {

    if(Estados.length > 0)
    {
      let estado =  Estados.filter( f => f.estado == Estado);
        if(estado.length == 1)
         return estado[0].Icono.split('-').pop();

    }
      return 'success' 
   
  }

  const PintarIconosMenu = (row: any) => {
    return (
      <div className="dropdown show ">
        <a className="dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className='bi-menu-button-wide primary'></i>
          {/* style={{ backgroundColor: 'white' }}  */}
        </a>
        <div style={{ zIndex: 2 }} className="dropdown-menu position-relative mb-5" aria-labelledby="dropdownMenuLink">
          {
            Estados.map((val, index) => {
              return (
                <a id={`${val.estadoIdS}`} key={val.estadoIdS + index} data-rel={`${val.estado}`} className="dropdown-item" onClick={CambiarEstado} data-target={row}>
                  <i title={val.estado} className={val.Icono}></i>
                  {<>&nbsp;</>}
                  {val.estado}
                </a>
              )
            })
          }
        </div>
      </div>
    )
  }

  const ConsultarEstados = () => {
    setCargando(true);
    GetEstadosTransmision(TipoIds).then((response: AxiosResponse<any>) => {
      setEstados(response.data);
      setCargando(false);
    }).catch(({ error }) => {
      setCargando(false);
    });
  }

  useEffect(() => {

    ConsultarEstados();
    (Filtrado == undefined ? setDatalocal((Data ? Data : [])) : setDatalocal((DataFiltrada ? DataFiltrada : [])));
    return () => setData([]);
  }, [])

  useEffect(() => {
    if (Filtrado == undefined || Filtrado == false) {
      setDatalocal((Data ? Data : []));
      setRowCount(Data ? Data.length : 0)
    } else {
      setDatalocal((DataFiltrada ? DataFiltrada : []))
      setRowCount((DataFiltrada ? DataFiltrada.length : 0))
    }

  }, [Filtrado, Data, DataFiltrada]);

  const CambiarEstado = (event: any) => {
    let Estado = event.target.attributes.id.value;
    let AssetId = event.target.attributes['data-target'].value;
    let NombreEstado = event.target.attributes['data-rel'].value;
    confirmarDialog(() => {
      setCargando(true);
      SetEstadoSyscaf(AssetId, Estado).then((response: AxiosResponse) => {
        if (response.statusText == "OK") {
          let vehiculo = (Data as any[]).map((lis) => {
            if (lis.assetId === AssetId) {
              lis.estadoSyscaf = NombreEstado;
            }
            return lis;
          });
          setData(vehiculo);
        }
        successDialog("¡Operación Éxitosa!", "");
        setCargando(false);
      }).catch(() => {
        errorDialog("Ha ocurrido un error al cambiar el estado del activo", "");
        setCargando(false);
      })
    }, `¿Esta seguro que desea cambiar el estado del activo?`, 'Guardar')
  };

  return (
    <>

      <BlockUi tag="span" className="shadow-sm" loader={<><img alt="Logo" src="/media/logos/logo-compact.svg" className="mh-50px" /> Cargando...</>} keepInView blocking={(Cargando == undefined ? true : Cargando)}>
        <MaterialReactTable
          localization={MRT_Localization_ES}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
                width: 100
              },
              size: 3,

            },
          }}
          muiTableHeadCellProps={{
            sx: (theme) => ({
              fontSize: 14,
              fontStyle: 'bold',
              color: 'rgb(27, 66, 94)'
            }),
          }}
          columns={listadoCampos}
          data={DataLocal}
          enableTopToolbar={true}
          enableColumnOrdering
          //  enableStickyHeader
          enableDensityToggle={false}
          enablePagination={false}
          enableRowVirtualization
          muiTableContainerProps={{
            sx: { maxHeight: '500px' }, //give the table a max height
          }}
          rowCount={rowCount}
          enableFilters
          enableColumnFilters={false}
          initialState={{ columnVisibility: VisibleDefault, density: 'compact' }}
        />
      </BlockUi>
    </>
  )
}

export { TableReporte }
