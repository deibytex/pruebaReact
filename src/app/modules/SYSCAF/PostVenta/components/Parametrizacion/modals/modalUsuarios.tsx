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
import { getConfiguracion, getUsuarios, setConfiguracion } from "../../../data/parametrizacionData";
import { setGestor } from "../../../../../Fatigue/data/dashBoardData";


type Props = {
    show: boolean;
    handleClose: () => void;
    title?: string;
};

export const UpdateUsuarios: React.FC<Props> = ({ show, handleClose, title }) => {

    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    const model = (isAuthorized as UserModelSyscaf);

    const [errorDLP, seterrorDLP] = useState<any>("");
    const [nombre, setnombre] = useState("");
    const [userid, setuserid] = useState("");
    const [esGestor, setesGestor] = useState<boolean>(false);

    const [usersinEditar, setusersinEditar] = useState("");
    const [tituloModalTickets, settituloModalTickets] = useState('');

    const [rowCount, setRowCount] = useState(0);
    const [Data, setData] = useState<any[]>([]);
    const [usuarios, setusuarios] = useState<any[]>([]);
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

        setnombre("");
        setuserid("");
        setnombre("");
        setesGestor(false);

        setshowModal(false);
    };

    const showModals = () => {
        settituloModalTickets('Editar Listado Usuarios')
        setshowModal(true);
      }

    let listadoCampos: MRT_ColumnDef<any>[] =

        [
            {
                accessorKey: 'nombre',
                header: 'Usuario',
                size: 100
            },
            {
                accessorKey: 'esGestor',
                header: 'Es Gestor',
                size: 50,
                Cell({ cell, column, row, table, }) {
                  return (cell.getValue() == true) ? <span >Si</span>
                        : <span>No</span>
                },
            }
        ];

        useEffect(() => {

            getConfiguracion(title == 'Parametrizar Usuarios ST' ? 'CUSST' : 'COUSS').then((response) => {
        
              JSON.parse(response.data[0].Configuracion) ? setData(JSON.parse(response.data[0].Configuracion) as any[])
                : setData([]);

             
        
            });

            getUsuarios('-1').then((response) => {
        
                setusuarios(response.data)              
          
              });
        
          }, [title])

          useEffect(() => {

            let nombre = (usuarios).filter(nom => nom.Id == userid)[0];

            setnombre(nombre != undefined ? nombre.Nombres : '');
        
          }, [userid])


    function SelectUsuario() {
        return (
            <Form.Select className=" mb-3 " name="tipo" value={userid} onChange={(e) => {
                // buscamos el objeto completo para tenerlo en el sistema

                //validar con yuli si se puede obtener el key desde aquí                 
                setuserid(e.currentTarget.value as any);
            }}>
                  <option value={0}>Selecione Usuario</option>
                {(usuarios).map((u) => {
                    return (
                        <option key={u.Id} value={u.Id}>
                            {u.Nombres}
                        </option>
                    );
                })} 

            </Form.Select>
        );
    }

    const modalSetUsuarios = (row: any) => {

        setusersinEditar(row.UserId);
        setuserid(row.UserId);
        setnombre(row.nombre);
        setesGestor(row.esGestor);
        showModals();
      }

      

    const setUsers = (tipoModificacion: any, userEditar?: any) => {

        let usuariosSoporte: any = {};
        let movimientos: any = {};
        let mensaje: any = "";
        let tipoMovimiento: any = "";


        if (tipoModificacion == "1") {
            mensaje = "Se agrega nuevo usuario";
            tipoMovimiento = "Creación";
        }
        else if (tipoModificacion == "2") {
            mensaje = "Se edita usuario";
            tipoMovimiento = "Edición";
        }
        else {
            mensaje = "Se elimina usuario";
            tipoMovimiento = "Eliminacion";
        }

        usuariosSoporte = {
            UserId: userid,
            nombre,
            esGestor
        };

        setusersinEditar(userid);

        movimientos = {
            fecha: FechaServidor(),
            usuario: model.Nombres,
            tipo: tipoMovimiento,
            mensaje
        };

        confirmarDialog(() => {
            if (tipoModificacion == "1") {
                setConfiguracion(title == 'Parametrizar Usuarios ST' ? 'CUSST' : 'COUSS', '[' + JSON.stringify(usuariosSoporte) + ']', '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
                    successDialog("Operación Éxitosa", "");
                    setData([...Data, JSON.parse(JSON.stringify(usuariosSoporte))] as any[]);
                    setnombre("");
                    setuserid("");
                    setesGestor(false);
                }).catch((error) => {
                    errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
                });
            }
            else if (tipoModificacion == "2" || tipoModificacion == "3") {
                let conf = Data.filter(lis => lis.UserId != (tipoModificacion == "2" ? usersinEditar : userEditar));

                
                usuariosSoporte = {
                    UserId: userid,
                    nombre,
                    esGestor
                };

                if (tipoModificacion == "2")
                    conf.push(usuariosSoporte);



                setConfiguracion(title == 'Parametrizar Usuarios ST' ? 'CUSST' : 'COUSS', JSON.stringify(conf), '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
                    successDialog("Operación Éxitosa", "");
                    setData(JSON.parse(JSON.stringify(conf)) as any[]);
                    setnombre("");
                    setuserid("");
                    setesGestor(false);
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
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Usuario:</label>
                            <SelectUsuario />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Es Gestor:</label>
                            <div className="">
                                <input className=" m-3"
                                    type="checkbox"
                                    checked={esGestor}
                                    onChange={(e) =>
                                        setesGestor(e.target.checked)
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
                                                    modalSetUsuarios(row.original);
                                                }}
                                            >
                                                <Update />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip arrow placement="left" title="eliminar">
                                            <IconButton
                                                onClick={() => {
                                                    setUsers('3', row.original.UserId);
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
                        setUsers("1", null);
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
                            <label className="control-label label label-sm  m-3" htmlFor="señales" style={{ fontWeight: 'bold' }}>Usuario:</label>
                            <SelectUsuario />
                        </div>
                        <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                            <label className="control-label label label-sm  m-3" htmlFor="dlp" style={{ fontWeight: 'bold' }}>Es Gestor:</label>
                            <div className="">
                                <input className=" m-3"
                                    type="checkbox"
                                    checked={esGestor}
                                    onChange={(e) =>
                                        setesGestor(e.target.checked)
                                        // setGeneraIMG(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => {
                        setUsers("2", null);
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
