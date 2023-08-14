import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../../../../_start/helpers/components/ConfirmDialog";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Update } from "@mui/icons-material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { isError } from "util";
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table";
import { FechaServidor } from "../../../../../../../_start/helpers/Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../setup";
import { UserModelSyscaf } from "../../../../../auth/models/UserModel";
import { getConfiguracion, setConfiguracion } from "../../../data/parametrizacionData";


type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
};

export const UpdateTickets: React.FC<Props> = ({ show, handleClose, title }) => {

    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    const model = (isAuthorized as UserModelSyscaf);

    const [errorDLP, seterrorDLP] = useState<any>("");
    const [tipo, settipo] = useState("");
    const [nombre, setnombre] = useState("");
    const [diasTickets, setdiasTickets] = useState("");
    const [diasSenales, setdiasSenales] = useState("");
    const [notificar, setnotificar] = useState<boolean>(false);

    const [nombresinEditar, setnombresinEditar] = useState("");
    const [tituloModalTickets, settituloModalTickets] = useState('');

    const [rowCount, setRowCount] = useState(0);
    const [Data, setData] = useState<any[]>([]);
;
    const [showModal, setshowModal] = useState(false);

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

    const handleClose2 = () => {
        settituloModalTickets('');

        settipo("");
        setdiasSenales("");
        setdiasTickets("");
        setnombre("");
        setnotificar(false);

        setshowModal(false);
    };

    let listadoCampos: MRT_ColumnDef<any>[] =

        [
            {
                accessorKey: 'tipo',
                header: 'Tipo',
                size: 100
            },
            {
                accessorKey: 'nombre',
                header: 'Nombre',
                size: 100
            },
            {
                accessorKey: 'valor',
                header: 'Días Tickets',
                size: 80
                // ,
                // Cell({ cell, column, row, table, }) {
        
                //   return (
                //     <>
                //       {
                //         JSON.parse(row.original.valor).length
                //       }
                //     </>
        
                //   )
                // },
            },
            // {
            //     accessorKey: 'valor',
            //     header: 'Días señales',
            //     size: 80
            //     // ,
            //     // Cell({ cell, column, row, table, }) {
        
            //     //   return (
            //     //     <>
            //     //       {
            //     //         JSON.parse(row.original.valor).length
            //     //       }
            //     //     </>
        
            //     //   )
            //     // },
            // },
            // {
            //     accessorKey: 'valor',
            //     header: 'Notificar',
            //     size: 80
            //     // ,
            //     // Cell({ cell, column, row, table, }) {
        
            //     //   return (
            //     //     <>
            //     //       {
            //     //         JSON.parse(row.original.valor).length
            //     //       }
            //     //     </>
        
            //     //   )
            //     // },
            // }

        ];

        useEffect(() => {

            getConfiguracion('3').then((response) => {
        
              JSON.parse(response.data[0].Configuracion) ? setData(JSON.parse(response.data[0].Configuracion) as any[])
                : setData([]);

             
        
            });
        
          }, [])

          useEffect(() => {

           console.log(Data);
        
          }, [Data])

    function SelectTipo() {
        return (
            <Form.Select className=" mb-3 " name="tipo" value={tipo} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                settipo(e.currentTarget.value as any);
            }}>
                <option value={0}>Selecione tipo</option>
                <option value={1}>Sistema</option>

            </Form.Select>
        );
    }

    const setTickets = (tipoModificacion: any) => {

        let parametrosTickets: any = {};
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
        else {
            mensaje = "Se elimina configuración";
            tipoMovimiento = "Eliminacion";
        }

        parametrosTickets = {
            tipo,
            nombre,
            valor: {
                diasTickets,
                diasSenales,
                notificar
            }
        };

        setnombresinEditar(nombre);

        movimientos = {
            fecha: FechaServidor(),
            usuario: model.Nombres,
            tipo: tipoMovimiento,
            mensaje
        };

        confirmarDialog(() => {
            if (tipoModificacion == "1") {
                setConfiguracion('3', '[' + JSON.stringify(parametrosTickets) + ']', '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
                    successDialog("Operación Éxitosa", "");
                    setData([...Data, JSON.parse(JSON.stringify(parametrosTickets))] as any[]);
                    setnombre("");
                    settipo("");
                    setdiasSenales("");
                    setdiasTickets("");
                    setnotificar(false);
                }).catch((error) => {
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                });
            }
            else if (tipoModificacion == "2" || tipoModificacion == "3") {
                let conf = Data.filter(lis => lis.nombre != nombresinEditar);


                parametrosTickets = {
                    tipo,
                    nombre,
                    valor: {
                        diasTickets,
                        diasSenales,
                        notificar
                    }
                };

                if (tipoModificacion == "2")
                    conf.push(parametrosTickets);



                setConfiguracion('3', JSON.stringify(conf), '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
                    successDialog("Operación Éxitosa", "");
                    setData(JSON.parse(JSON.stringify(conf)) as any[]);
                    setnombre("");
                    settipo("");
                    setdiasSenales("");
                    setdiasTickets("");
                    setnotificar(false);
                    handleClose2();
                }).catch((error) => {
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                });
            }

        }, tipoModificacion == "1" ? `Esta seguro que desea agregar la configuracion` : tipoModificacion == "2" ? `Esta seguro de modificar la configurción`
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
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Tipo:</label>
                            <SelectTipo />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Nombre:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese nombre" type="text" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Días Señales:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese días" type="text" />
                        </div>

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Días Tickets:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese días" type="text" />
                        </div>
                    </div>
                    <div className="row">


                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Notificar:</label>
                            <div className="">
                            <input className=" m-3"
                                    type="checkbox"
                                    checked={notificar}
                                    onChange={(e) =>
                                        setnotificar(e.target.checked)
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
                                                    // modalSetCorreo(row.original.CorreoTxIdS, row.original.tipoCorreo, row.original.correo);
                                                }}
                                            >
                                                <Update />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip arrow placement="left" title="eliminar">
                                            <IconButton
                                                onClick={() => {
                                                    // deleteCorreo(row);
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
                        setTickets("1");
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
                    <Modal.Title>{tituloModalTickets}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Tipo:</label>
                            <SelectTipo />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Nombre:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese nombre" type="text" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Días Señales:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese días" type="text" />
                        </div>

                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Días Tickets:</label>
                            <input className="form-control  input input-sm mb-3" placeholder="Ingrese días" type="text" />
                        </div>
                    </div>
                    <div className="row">


                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Notificar:</label>
                            <div className="">
                            <input className=" m-3"
                                    type="checkbox"
                                    checked={notificar}
                                    onChange={(e) =>
                                        setnotificar(e.target.checked)
                                        // setGeneraIMG(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                        setTickets("2");
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
