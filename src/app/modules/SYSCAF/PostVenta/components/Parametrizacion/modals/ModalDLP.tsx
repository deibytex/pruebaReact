import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../../../../_start/helpers/components/ConfirmDialog";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Update } from "@mui/icons-material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { isError } from "util";
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table";
import { getConfiguracion, setConfiguracion } from "../../../data/parametrizacionData";
import { FechaServidor } from "../../../../../../../_start/helpers/Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../setup";
import { UserModelSyscaf } from "../../../../../auth/models/UserModel";



type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
};

export const UpdateDLP: React.FC<Props> = ({ show, handleClose, title }) => {

    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
      );
    
      const model = (isAuthorized as UserModelSyscaf);

    const [errorDLP, seterrorDLP] = useState<any>("");

    const [tipo, settipo] = useState<any>("");
    const [categoria, setcategoria] = useState<any>("");
    const [label, setlabel] = useState("");
    const [order, setorder] = useState("");
    const [valores, setvalores] = useState("");
    const [observaciones, setobservaciones] = useState("");
    const [esobligatorio, setesobligatorio] = useState<boolean>(false);

    const [labelsinEditar, setlabelsinEditar] = useState("");


    const [rowCount, setRowCount] = useState(0);

    const [tituloModalDLP, settituloModalDLP] = useState('');
    const [Data, setData] = useState<any[]>([]);

    const [showModal, setshowModal] = useState(false);

    const handleClose2 = () => {
        settituloModalDLP('');
        setobservaciones("");
        setcategoria("");
        setlabel("");
        setvalores("");
        settipo("");
        setorder("");
        setobservaciones("");
        setesobligatorio(false);
        setshowModal(false);
      };


    //table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    let listadoCampos: MRT_ColumnDef<any>[] =

        [
            {
                accessorKey: 'order',
                header: 'Orden',
                size: 100
            },
            {
                accessorKey: 'categoria',
                header: 'Caterogia',
                size: 100
            },
            {
                accessorKey: 'label',
                header: 'Label',
                size: 100
            },
            {
                accessorKey: 'tipo',
                header: 'Tipo',
                size: 100
            },
            {
                accessorKey: 'observaciones',
                header: 'Observaciones',
                size: 100
            },
            {
                accessorKey: 'valores',
                header: 'Valores',
                size: 100
            },
            {
                accessorKey: 'esobligatorio',
                header: 'esobligatorio',
                size: 50,
                Cell({ cell, column, row, table, }) {
                  return (cell.getValue() == true) ? <span >Verdadero</span>
                        : <span>Falso</span>
                },
              },

        ];

        const showModals = () => {
            settituloModalDLP('Editar Listado DLP')
            setshowModal(true);
          }

        useEffect(() => {

            getConfiguracion('2').then((response) => {
        
              JSON.parse(response.data[0].Configuracion) ? setData(JSON.parse(response.data[0].Configuracion) as any[])
                : setData([]);
        
            });
        
          }, [])

    function SelectCategoria() {
        return (
            <Form.Select className=" mb-3 " name="tipo" value={categoria} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setcategoria(e.currentTarget.value as any);
            }}>
                <option value={0}>Selecione Categoria</option>
                <option value={'transmision'}>Transmisión</option>
                {/* <option value={2}>Soporte</option> */}

            </Form.Select>
        );
    }

    function SelectTipo() {
        return (
            <Form.Select className=" mb-3 " name="tipo" value={tipo} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                settipo(e.currentTarget.value as any);
            }}>
                <option value={0}>Selecione tipo</option>
                <option value={'Check Box'}>Check Box</option>
                <option value={'Lista'}>Lista</option>
                <option value={'Text Box'}>Text Box</option>

            </Form.Select>
        );
    }

    const modalSetDLP = (row: any) => {

        setlabelsinEditar(row.label);
        setorder(row.order)
        settipo(row.tipo);
        setlabel(row.label);
        setvalores(row.valores);
        setcategoria(row.categoria);
        setobservaciones(row.observaciones);
        setesobligatorio(row.esobligatorio);
        showModals();
      }

      const deleteDLP = (row: any) => {

        setlabelsinEditar(row.label);
        setDLP("3");
      }

    const setDLP = (tipoModificacion: any) => {

        let parametrosDLP: any = {};
        let movimientos: any = {};
        let mensaje: any = "";
        let tipoMovimiento: any = "";
    
    
        if (tipoModificacion == "1") {
          mensaje = "Se agrega nueva configuración";
          tipoMovimiento = "Creación";
        }
        else if (tipoModificacion == "2") {
          mensaje = "Se edita configuración";
          tipoMovimiento = "Edición";
        }
        else{
          mensaje = "Se elimina configuración";
          tipoMovimiento = "Eliminacion";
        }
    
        parametrosDLP = {
          order,
          categoria,
          label,
          valores,
          tipo,
          observaciones,
          esobligatorio
        };

        setlabelsinEditar(label);
    
        movimientos = {
          fecha: FechaServidor(),
          usuario: model.Nombres,
          tipo: tipoMovimiento,
          mensaje
        };
    
        confirmarDialog(() => {
          if (tipoModificacion == "1") {
            setConfiguracion('2', '[' + JSON.stringify(parametrosDLP) + ']', '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
              successDialog("Operación Éxitosa", "");
              setData([...Data, JSON.parse(JSON.stringify(parametrosDLP))] as any[]);
              setobservaciones("");
              setcategoria("");
              setlabel("");
              setvalores("");
              settipo("");
              setorder("");
              setobservaciones("");
              setesobligatorio(false);
            }).catch((error) => {
              errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            });
          }
          else if (tipoModificacion == "2" || tipoModificacion == "3"){
            let conf = Data.filter(lis => lis.label != labelsinEditar);
            
    
            parametrosDLP = {
                order,
                categoria,
                label,
                valores,
                tipo,
                observaciones,
                esobligatorio
              };
    
            if (tipoModificacion == "2")
            conf.push(parametrosDLP);
           
         
    
            setConfiguracion('2', JSON.stringify(conf), '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
              successDialog("Operación Éxitosa", "");
              setData(JSON.parse(JSON.stringify(conf)) as any[]);
              setobservaciones("");
              setcategoria("");
              setlabel("");
              setvalores("");
              settipo("");
              setobservaciones("");
              setesobligatorio(false);
              handleClose2();
            }).catch((error) => {
              errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
            });
          }
    
        }, tipoModificacion == "1" ? `Esta seguro que desea agregar la configuracion` : tipoModificacion == "2"  ? `Esta seguro de modificar la configurción`
                : `Esta seguro de eliminar la configurción`
          , "Guardar");
    
      };

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Orden:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Orden" type="text" value={order} onChange={(e) => { setorder(e.target.value); }} />
                        </div>

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Categoria:</label>
                            <SelectCategoria />
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Label:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Label" type="text" value={label} onChange={(e) => { setlabel(e.target.value); }} />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Tipo:</label>
                            <SelectTipo />
                        </div>

                        
                    </div>
                    <div className="row">

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Observaciones:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Observaciones" type="text" value={observaciones} onChange={(e) => { setobservaciones(e.target.value); }} />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Valores:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Valores" type="text" value={valores} onChange={(e) => { setvalores(e.target.value); }} />
                        </div>
                    </div>
                    <div className="row">

                    <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Es obligatorio:</label>
                            <div className="">
                                <input className=" m-3"
                                    type="checkbox"
                                    checked={esobligatorio}
                                    onChange={(e) =>
                                        setesobligatorio(e.target.checked)
                                        // setGeneraIMG(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Body>
                    <div>
                        <MaterialReactTable
                            localization={MRT_Localization_ES}
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    muiTableHeadCellProps: {
                                        align: 'center',
                                    },
                                    size: 120,
                                },
                            }}
                            columns={listadoCampos}
                            data={Data}
                            // editingMode="modal" //default         
                            enableTopToolbar={false}
                            enableColumnOrdering
                            enableEditing
                            enablePagination={false}
                            // enableEditing
                            /* onEditingRowSave={handleSaveRowEdits}
                                onEditingRowCancel={handleCancelRowEdits}*/
                            muiToolbarAlertBannerProps={
                                isError
                                    ? {
                                        color: 'error',
                                        children: 'Error al cargar información',
                                    }
                                    : undefined
                            }
                            onColumnFiltersChange={setColumnFilters}
                            onGlobalFilterChange={setGlobalFilter}
                            onPaginationChange={setPagination}
                            onSortingChange={setSorting}
                            rowCount={rowCount}

                            state={{
                                columnFilters,
                                globalFilter,
                                isLoading,
                                pagination,
                                showAlertBanner: isError,
                                showProgressBars: isRefetching,
                                sorting,
                            }}

                            renderRowActions={({ row, table }) => (
                                <>
                                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                                        <Tooltip arrow placement="left" title="modificar">
                                            <IconButton
                                                onClick={() => {
                                                    modalSetDLP(row.original);
                                                }}
                                            >
                                                <Update />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip arrow placement="left" title="eliminar">
                                            <IconButton
                                                onClick={() => {
                                                    deleteDLP(row.original);
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </>
                            )
                            }
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                       setDLP("1");
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showModal}
                onHide={handleClose2}
                size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{tituloModalDLP}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Orden:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Orden" type="text" value={order} onChange={(e) => { setorder(e.target.value); }} />
                        </div>

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Categoria:</label>
                            <SelectCategoria />
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Label:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Label" type="text" value={label} onChange={(e) => { setlabel(e.target.value); }} />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Tipo:</label>
                            <SelectTipo />
                        </div>

                        
                    </div>
                    <div className="row">

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Observaciones:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Observaciones" type="text" value={observaciones} onChange={(e) => { setobservaciones(e.target.value); }} />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Valores:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese Valores" type="text" value={valores} onChange={(e) => { setvalores(e.target.value); }} />
                        </div>
                    </div>
                    <div className="row">

                    <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Es esobligatorio:</label>
                            <div className="">
                                <input className=" m-3"
                                    type="checkbox"
                                    checked={esobligatorio}
                                    onChange={(e) =>
                                        setesobligatorio(e.target.checked)
                                        // setGeneraIMG(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                       setDLP("2");
                    }}>
                        Guardar
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleClose2}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}
