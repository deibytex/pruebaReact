import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../../../../_start/helpers/components/ConfirmDialog";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { isError } from "util";
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table";
import { getConfiguracion, setConfiguracion } from "../../../data/parametrizacionData";
import { FechaServidor } from "../../../../../../../_start/helpers/Helper";
import { tipoRequerimientos } from "../../../mockData/parametrizacion";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Update } from "@mui/icons-material";



type Props = {
  show: boolean;
  handleClose: () => void;
  title?: string;
};

export const UpdateRequerimientos: React.FC<Props> = ({ show, handleClose, title }) => {
  // const { ListaNotifacionId, CorreoId, Correo, tipoCorreo, detalleListas, CorreosTx, setCorreo, settipoCorreo, setCorreosTx } = useDataCorreosTx();
  const [errorRequerimientos, seterrorRequerimientos] = useState<any>("");
  const [tipo, settipo] = useState<any>(0);
  const [flujo, setflujo] = useState<any>(0);
  const [valor, setvalor] = useState("");
  const [label, setlabel] = useState("");

  const [Data, setData] = useState<any[]>([]);

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

  const [rowCount, setRowCount] = useState(0);

  let listadoCampos: MRT_ColumnDef<any>[] =

    [
      {
        accessorKey: 'tipo',
        header: 'tipo',
        size: 100
      },
      {
        accessorKey: 'label',
        header: 'label',
        size: 100
      },
      {
        accessorKey: 'valor',
        header: 'valor',
        size: 100
      },
      {
        accessorKey: 'flujo',
        header: 'flujo',
        size: 100
      }

    ];

  //primer cargue carga userid
  useEffect(() => {
    getConfiguracion('1');
  }, [])

  useEffect(() => {

    getConfiguracion('1').then((response) => {
      console.log(response.data[0]);
      setData(JSON.parse(response.data[0].Configuracion) as any[]);

    });

  }, [])

  function Selecttipo() {
    return (
      <Form.Select className=" mb-3 " name="tipo" value={tipo} onChange={(e) => {
        // buscamos el objeto completo para tenerlo en el sistema

        //validar con yuli si se puede obtener el key desde aquí                 
        settipo(e.currentTarget.value as any);
      }}>
        <option value={0}>Selecione tipo</option>
        {(JSON.parse(JSON.stringify(tipoRequerimientos))).map((cli: any) => {

          return (
            <option key={cli.valor} value={cli.valor
            }>
              {cli.nombre}
            </option>
          );
        })}

      </Form.Select>
    );
  }

  function SelectFlujo() {
    return (
      <Form.Select className=" mb-3 " name="tipo" value={flujo} onChange={(e) => {
        // buscamos el objeto completo para tenerlo en el sistema

        //validar con yuli si se puede obtener el key desde aquí                 
        setflujo(e.currentTarget.value as any);
      }}>
        <option value={0}>Selecione flujo</option>
        {(JSON.parse(JSON.stringify(Data))).map((cli: any) => {

          return (
            <option key={cli.valor} value={cli.valor
            }>
              {cli.label}
            </option>
          );
        })}

      </Form.Select>
    );
  }



  const setRequerimientos = (tipoModificacion: any) => {

    let parametrosRequerimientos: any = {};
    let movimientos: any = {};
    let mensaje: any = "";
    let tipoMovimiento: any = "";


    if (tipoModificacion == 1) {
      mensaje = "Se agrega nueva configuración";
      tipoMovimiento = "Creación";
    }

    parametrosRequerimientos = {
      tipo,
      label,
      valor,
      flujo
    };

    movimientos = {
      fecha: FechaServidor(),
      usuario: 1,
      tipo: tipoMovimiento,
      mensaje
    };


    confirmarDialog(() => {
      if (title == "Parametrizar Requerimientos") {
        setConfiguracion('1', '[' + JSON.stringify(parametrosRequerimientos) + ']', '[' + JSON.stringify(movimientos) + ']').then((response) => {
          successDialog("Operación Éxitosa", "");
          setData([...Data, JSON.parse(JSON.stringify(parametrosRequerimientos))] as any[]);
          handleClose();
          settipo(0);
          setflujo(0);
          setlabel("");
          setvalor("");
        }).catch((error) => {
          errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
        });
      }
      else {
        // setRequerimientossTx(Correo, tipoCorreo, CorreoId).then((response) => {

        //     if (response.statusText == "OK") {
        //         let correosedit = (CorreosTx as CorreosTx[]).map(function (dato) {
        //             if (dato.CorreoTxIdS == CorreoId) {
        //                 dato.correo = Correo;
        //                 dato.tipoCorreo = tipoCorreo;
        //                 dato.tipoEnvio = (detalleListas as DetalleListas[]).filter(lis => lis.DetalleListaId == tipoCorreo)[0].Nombre;
        //             }
        //             return dato;
        //         });
        //         setCorreosTx(correosedit); 
        //         successDialog("Operación Éxitosa", "");
        //         handleClose();
        //     }
        //     else
        //         errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
        // }).catch((error) => {
        //     errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
        // });
        console.log('otro');
      }

    }, title == "Agregar configuración" ? `Esta seguro que desea agregar la configuracion` : `Esta seguro que modificar`
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
              <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Tipo:</label>
              <Selecttipo />
            </div>
            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
              <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Label:</label>
              <input className="form-control  input input-sm mb-3" placeholder="Ingrese Label" type="text" value={label} onChange={(e) => { setlabel(e.target.value); }} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
              <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Valor:</label>
              <input className="form-control  input input-sm mb-3" placeholder="Ingrese Valor" type="text" value={valor} onChange={(e) => { setvalor(e.target.value); }} />
            </div>
            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
              <label className="control-label label label-sm  m-3" htmlFor="requerimientos" style={{ fontWeight: 'bold' }}>Flujo:</label>
              <SelectFlujo />
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
            setRequerimientos(1);
          }}>
            Guardar
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}
