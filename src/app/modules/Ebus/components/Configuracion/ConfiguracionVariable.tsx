import BlockUi from "@availity/block-ui";
import { Check, Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import MaterialReactTable, { MaterialReactTableProps,  MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import {  useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5";
import confirmarDialog, { errorDialog, successDialog } from "../../../../../_start/helpers/components/ConfirmDialog";
import { GetVariables, SetEstadoParametros, SetVariablesCliente } from "../../data/Configuracion";

import { ModalConfiguracionVariableAdd } from "./ModalConfiguracionVariableAdd"

type Props = {
    show:boolean;
    handleClose:() =>void;
    title:string;
    ClienteId:string;
    UsuarioIds:string;
    ClienteIds:string;
}

const  ConfiguracionVariables: React.FC<Props> = ({show,handleClose, title, ClienteId, UsuarioIds, ClienteIds}) =>{

  const [showModalConfiguracionVariableAdd, setshowModalConfiguracionVariableAdd] = useState<boolean>(false)

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
    const [data, setData] = useState<MRT_ColumnDef<any>[]>([]);
   // fin table state
   const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
  const [EsVisible, setEsVisible] = useState<boolean>(true);
   useEffect(() =>{
    setEsVisible(true);
    ConsultarDatos();
   },[ClienteId])

   const ConsultarDatos = () =>{
    GetVariables(ClienteId).then((response:AxiosResponse<any>) =>{
      setData(response.data);
      setEsVisible(false);
  }).catch((error) =>{
      errorDialog("Error al consultar las variables","")
      setEsVisible(false);
  });
   }


    let listadoCampos: MRT_ColumnDef<any>[] =
    [
        {
            accessorKey: 'Cliente',
            header: 'Nombre',
            size: 5,
            enableEditing:false, 
        },
        {
            accessorKey: 'Valor',
            header: 'Valor',
            Cell({ cell, column, row, table, }) {
              return (row.original.Valor);
          },
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              error:!!validationErrors[cell.id],
              helperText:validationErrors[cell.id],
              required: true,
              onBlur: (event) => {
                const value = event.target['value'];
                if (!value) {
                  setValidationErrors((prev) => ({ ...prev, Valor: 'Valor requerido' }));
                } 
              }
            }),
            size: 5
        },
        {
            accessorKey: 'Tipo',
            header: 'Tipo',
            size: 5,
            enableEditing:false, 
        },
        {
            accessorKey: 'FechaSistema',
            header: 'Fecha',
            Edit:({ cell, column, row, table, })=>{
              cell.column.getIsVisible();
            },
            Cell({ cell, column, row, table, }) {
                return (moment(row.original.FechaSistema).format("DD/MM/YYYY"));
            },
            enableEditing:false, 
            size: 5
        },
        {
            accessorKey: 'EsActivo',
            header: 'Estado',
            Edit:({ cell, column, row, table, })=>{
              cell.column.getIsVisible();
            },
            Cell({ cell, column, row, table, }) {
                return (row.original.EsActivo ? <span className="badge bg-primary">Activo</span>:<span className="badge bg-danger">Inactivo</span>);
            },
            enableEditing:false, 
            size: 5
        },
    ];
   const GuardarModificados = (row: any, value: any, table:any) =>{
    confirmarDialog(() => {
      setEsVisible(true);
      SetVariablesCliente(
        row.row.original.ClienteIds.toString(),
        row.row.original.TipoparametroId.toString(),
        UsuarioIds,
        value, 
        row.row.original.ParametrizacionId.toString(),
     )
     .then((response: AxiosResponse<any>) =>{
         successDialog(`Variable actualizada éxitosamente`,"");
         ConsultarDatos()
         setEsVisible(false);
         table.setEditingRow();
    
     })
     .catch(() =>{
         errorDialog("Ha ocurrido un error, al actualizar la variable con el cliente","");
         setEsVisible(false);
     });

  }, `¿Esta seguro que desea editar el registro?`, 'Guardar');
   }
    const handleSaveRowEdits: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        confirmarDialog(() => {
          setEsVisible(true);
          SetVariablesCliente(
            row.original.ClienteIds.toString(),
            row.original.TipoparametroId.toString(),
            UsuarioIds,
            row.original.Valor.toString(), 
            row.original.ParametrizacionId.toString(),
         )
         .then((response: AxiosResponse<any>) =>{
             successDialog(`Variable actualizada éxitosamente`,"");
             exitEditingMode(); //re
             ConsultarDatos()
             setEsVisible(false);
        
         })
         .catch(() =>{
             errorDialog("Ha ocurrido un error, al actualizar la variable con el cliente","");
             setEsVisible(false);
             exitEditingMode(); //required to exit editing mode and close modal
         });

      }, `¿Esta seguro que desea editar el registro?`, 'Guardar');
        //send/receive api updates here, then refetch or update local table data for re-render
        // setTableData([...tableData]);
      }
    };

     const CambiarEstado  = (row:any) =>{
      confirmarDialog(() => {
        setEsVisible(true);
        let EsActivo = !row.original.EsActivo;
        SetEstadoParametros(row.original.ParametrizacionId.toString(),row.original.TipoparametroId.toString(),EsActivo.toString()).then((response:AxiosResponse) =>{
          successDialog(`Variable actualizada éxitosamente`,"");
          setEsVisible(false);
            ConsultarDatos();
        }).catch(() =>{
          errorDialog("Ha ocurrido un error, al actualizar la variable con el cliente","");
          setEsVisible(false);
        });
      }, `¿Esta seguro que desea cambiar el estado del  registro?`, 'Guardar');
     }
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };
  
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
                    <div className="col-sm-4 col-md-4 col-xs-4">
                      
                    </div>
                    <div className="col-sm-4 col-md-4 col-xs-4">
                      
                    </div>
                    <div className="col-sm-4 col-md-4 col-xs-4">
                        <div  style={{float:'right'}}>
                            <button type="button" title="Agregar variable" className="btn btn-sm btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" onClick={() =>setshowModalConfiguracionVariableAdd(true) }><i className="bi-plus" ></i> Nueva variable</button>
                        </div>
                    </div>
                </div>
                <div style={{paddingTop:'10px'}}>

                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-xs-12">
                    <BlockUi tag="span" className="bg-primary"  keepInView blocking={EsVisible}>
                         <MaterialReactTable
                              displayColumnDefOptions={{
                                'mrt-row-actions': {
                                  muiTableHeadCellProps: {
                                    align: 'center',
                                  },
                                  size: 120,
                                },
                              }}
                                localization={MRT_Localization_ES}
                                columns={listadoCampos}
                                data={data}
                                editingMode="row" //default 
                                enableEditing
                                muiTableBodyCellEditTextFieldProps={({ cell , table}) => ({
                                  //onBlur is more efficient, but could use onChange instead
                                  onBlurCapture : (event:any) => {
                                    GuardarModificados(cell,event.target.value, table)
                                  },
                                })}
                                enableTopToolbar
                                onEditingRowSave={handleSaveRowEdits}
                                onEditingRowCancel={handleCancelRowEdits}
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
                                        <Tooltip arrow placement="left" title="Activar e inactivar variables">
                                        <IconButton color="success" onClick={() => {
                                              CambiarEstado(row);
                                            }} >
                                          <Check />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip arrow placement="top" title="Editar variables del cliente">
                                        <IconButton color="info" onClick={() => {
                                              table.setEditingRow(row)
                                            }
                                          } >
                                          <Edit />
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
                              </BlockUi>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                    <div className="">
                        <button type="button" className="btn btn-sm btn-secondary"  onClick={handleClose} data-bs-dismiss="modal">Cerrar</button>
                    </div>
            </Modal.Footer>
            </Modal>
            {(showModalConfiguracionVariableAdd) && ( <ModalConfiguracionVariableAdd show={showModalConfiguracionVariableAdd} handleClose={() => setshowModalConfiguracionVariableAdd(false)} title={"Agregar variable"} ClienteIds={ClienteIds} UsuarioIds={UsuarioIds} Consultar={ConsultarDatos }></ModalConfiguracionVariableAdd>)}
          
        </>
    )
}
export {ConfiguracionVariables}