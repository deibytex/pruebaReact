import { Check, House } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5";
import { errorDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetVariables } from "../../data/Configuracion";
import { TablaParametrizacionVariables } from "../../models/ConfiguracionModels";
import { ModalConfiguracionVariableAdd } from "./ModalConfiguracionVariableAdd"

type Props = {
    show:boolean;
    handleClose:() =>void;
    title:string;
    ClienteId:string;
}

const  ConfiguracionVariables: React.FC<Props> = ({show,handleClose, title, ClienteId}) =>{
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
    const [data, setData] = useState<TablaParametrizacionVariables[]>([]);
   // fin table state
   
   useEffect(() =>{
    GetVariables(ClienteId).then((response:AxiosResponse<any>) =>{
        setData(response.data);
    }).catch((error) =>{
        errorDialog("Error al consultar las variables","")
    });
   },[ClienteId])
    let listadoCampos: MRT_ColumnDef<TablaParametrizacionVariables>[] =
    [
        {
            accessorKey: 'Cliente',
            header: 'Nombre',
            size: 5
        },
        {
            accessorKey: 'Valor',
            header: 'Valor',
            size: 5
        },
        {
            accessorKey: 'Tipo',
            header: 'Tipo',
            size: 5
        },
        {
            accessorKey: 'FechaSistema',
            header: 'Fecha',
            Cell({ cell, column, row, table, }) {
                return (moment(row.original.FechaSistema).format("DD/MM/YYYY"));
            },
            size: 5
        },
        {
            accessorKey: 'EsActivo',
            header: 'Estado',
            Cell({ cell, column, row, table, }) {
                return (row.original.EsActivo ? <span className="badge bg-primary">Activo</span>:<span className="badge bg-danger">Inactivo</span>);
            },
            size: 5
        },
    ];
    return (
        <>
         <Modal 
                    show={show} 
                    onHide={handleClose} 
                    size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
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
                                        <IconButton color="success" onClick={() => {
                                             
                                            }} >
                                          <Check />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip arrow placement="top" title="Consultar y/o agregar location del cliente">
                                        <IconButton color="info" onClick={() => {

                                        }
                                          } >
                                          <House />
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
            </Modal.Body>
            <Modal.Footer>
                    <div className="">
                        <button type="button" className="btn btn-sm btn-secondary"  onClick={handleClose} data-bs-dismiss="modal">Cerrar</button>
                    </div>
            </Modal.Footer>
            </Modal>
            <ModalConfiguracionVariableAdd></ModalConfiguracionVariableAdd>
        </>
    )
}
export {ConfiguracionVariables}