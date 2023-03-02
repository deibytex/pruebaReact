import { AccessTimeFilled, Bedtime, BedTwoTone, Check, Delete, Download, Edit, House, Speed, SuperscriptTwoTone, SupervisorAccount, SupervisorAccountSharp, SupportAgent, Usb, Warehouse } from "@mui/icons-material";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table"
import { AxiosResponse } from "axios"
import MaterialReactTable, { MRT_ColumnDef, MRT_Row } from "material-react-table"
import { MRT_Localization_ES } from "material-react-table/locales/es"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { ObtenerClientesTabla } from "../../data/Configuracion"
import { TablaClienteEventoActivo, TablaDTO } from "../../models/ConfiguracionModels"
import { ConfiguracionPreferencia } from "./ConfiguracionPreferencia"
import { ConfiguracionVariables } from "./ConfiguracionVariable"
import { ModalAddClienteEbus } from "./ModalAddClienteEbus"
import { ModalConfiguracionTiempo } from "./ModalConfiguracionTiempo"
import { ModalListadousuarioTabla } from "./ModalListadoUsuarioTabla"
import { ModalLocaciones } from "./ModalLocaciones"
import { ModalUsuarios } from "./ModalUsuarios"
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import confirmarDialog, { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { Home, User, UserPlus } from "react-feather";
type Props = {

}

const ConfiguracionPrincipal:React.FC<Props> = () =>{
    //table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [isError, setIsError] = useState(false);

   // fin table state
   
    const [showModalClienteAdd, setModalClienteAdd] = useState<boolean>(false)
    const [data, setData] = useState<TablaClienteEventoActivo[]>([]);

    let listadoCampos: MRT_ColumnDef<TablaClienteEventoActivo>[] =
    [
        {
            accessorKey: 'clienteNombre',
            header: 'Nombre',
            size: 5
        },
        {
            accessorKey: 'fechaIngreso',
            header: 'Fecha',
            Cell({ cell, column, row, table, }) {
                return (moment(row.original.fechaIngreso).format("DD/MM/YYYY"));
            },
            size: 5
        }
    ];

    useEffect(() =>{
        ObtenerClientesTabla().then((response: AxiosResponse<any>) =>{
            setData(response.data.data);
            setRowCount(response.data.data.length)
        }).catch(({error}) =>{
            errorDialog("Ha ocurrido un error al consultar los datos","");
            setIsError(true);
        });
    },[])
    // ELIMINA LOGICAMENTE LA INFORMACION INGRESADA
  const handleDeleteRow = useCallback(
    (row: MRT_Row<TablaClienteEventoActivo>) => {

      confirmarDialog(() => {
      
      }, `Esta seguro que desea eliminar el archivo`);

    },
    [data],
  );
    return(
        <>
              <div className="row">
                    <div className="col-sm-6 col-md-6 col-xs-6">
                         
                    </div>
                    <div className="col-sm-6 col-md-6 col-xs-6">
                        <div  style={{float:'right'}}>
                            <button type="button" title="Agregar cliente" className="btn btn-sm btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" onClick={() => setModalClienteAdd(true)}><i className="bi-file-person-fill" ></i> Agregar cliente</button>
                        </div>
                    </div>
                    <div style={{paddingTop:'10px'}}></div>
                    <div className="col-sm-12 col-md-12 col-xs-12">
                            <MaterialReactTable
                                localization={MRT_Localization_ES}
                                displayColumnDefOptions={{
                                    'mrt-row-actions': {
                                      muiTableHeadCellProps: {
                                        align: 'center',
                                      },
                                      size: 50,
                                    },
                                  }}
                                columns={listadoCampos}
                                data={data}
                                enableEditing
                                editingMode="modal" //default 
                                onColumnFiltersChange={setColumnFilters}
                                onGlobalFilterChange={setGlobalFilter}
                                onPaginationChange={setPagination}
                                onSortingChange={setSorting}
                                rowCount={rowCount}
                                muiToolbarAlertBannerProps={
                                    isError
                                      ? {
                                        color: 'error',
                                        children: 'Error al cargar información',
                                      }
                                      : undefined
                                  }
                                initialState={{ density: 'compact' }}
                                renderRowActions={({ row, table }) => (
                                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                                        <Tooltip arrow placement="left" title="Activar e Inactivar clientes">
                                        <IconButton color="success" onClick={() => 
                                          console.log("activar clientes")
                                          } >
                                          <Check />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip arrow placement="top" title="Consultar y/o agregar location del cliente">
                                        <IconButton color="info" onClick={() => 
                                          console.log("activar clientes")
                                          } >
                                          <House />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip arrow placement="top" title="Consultar y/o agregar location del cliente">
                                        <IconButton color="success" onClick={() => 
                                            console.log("Consultar location")
                                          } >
                                             <SupportAgent />
                                          
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip arrow placement="top" title="Consultar listados de usuarios">
                                        <IconButton color="info"  onClick={() => 
                                          table.setEditingRow(row)
                                          } >
                                         <SupervisorAccount />
                                        </IconButton>
                                      </Tooltip>
                                        <Tooltip arrow placement="right" title="Configurar tiempo para cliente">
                                            <IconButton color="success" onClick={() => handleDeleteRow(row)}>
                                                <AccessTimeFilled />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                  )
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
                            />
                    </div>
            </div>
            <ModalAddClienteEbus show={showModalClienteAdd} handleClose={() => setModalClienteAdd(false)} title={"Agregar cliente"}></ModalAddClienteEbus>
            <ConfiguracionVariables></ConfiguracionVariables>
            <ConfiguracionPreferencia></ConfiguracionPreferencia>
            <ModalConfiguracionTiempo></ModalConfiguracionTiempo>
            <ModalListadousuarioTabla></ModalListadousuarioTabla>
            <ModalLocaciones></ModalLocaciones>
            <ModalUsuarios></ModalUsuarios>
        </>
    )
}
export {ConfiguracionPrincipal}