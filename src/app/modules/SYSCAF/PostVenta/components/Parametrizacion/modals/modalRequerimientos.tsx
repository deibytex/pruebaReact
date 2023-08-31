import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap-v5"
import confirmarDialog, { errorDialog, successDialog } from "../../../../../../../_start/helpers/components/ConfirmDialog";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { isError } from "util";
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table";
import { getConfiguracion, setConfiguracion } from "../../../data/parametrizacionData";
import { FechaServidor } from "../../../../../../../_start/helpers/Helper";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Update } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../setup";
import { UserModelSyscaf } from "../../../../../auth/models/UserModel";



type Props = {
  show: boolean;
  handleClose: () => void;
  title?: string;
};

export const UpdateRequerimientos: React.FC<Props> = ({ show, handleClose, title }) => {

  const isAuthorized = useSelector<RootState>(
    ({ auth }) => auth.user
  );

  const model = (isAuthorized as UserModelSyscaf);
 
  const [errorRequerimientos, seterrorRequerimientos] = useState<any>("");
  const [tipo, settipo] = useState("");
  const [flujo, setflujo] = useState("");
  const [valor, setvalor] = useState("");
  const [label, setlabel] = useState("");
  const [labelsinEditar, setlabelsinEditar] = useState("");

  const [showModal, setshowModal] = useState(false);

  const handleClose2 = () => {
    settituloModalParametrizacion('');
    settipo("");
    setflujo("");
    setlabel("");
    setvalor("");
    setshowModal(false);
  };

  const showModals = () => {
    settituloModalParametrizacion('Editar Requerimientos')
    setshowModal(true);
  }

  const [tituloModalParametrizacion, settituloModalParametrizacion] = useState('');
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



  useEffect(() => {

    getConfiguracion('1').then((response) => {

      JSON.parse(response.data[0].Configuracion) ? setData(JSON.parse(response.data[0].Configuracion) as any[])
        : setData([]);

    });

  }, [])

  function Selecttipo() {
    return (
      <Form.Select className=" mb-3 " name="tipo" value={tipo} onChange={(e) => {
        // buscamos el objeto completo para tenerlo en el sistema


        settipo(e.currentTarget.value as any);
      }}>
        <option value={0}>Selecione tipo</option>
        <option value={'Admin'}>Admin</option>
        <option value={'Soporte'}>Soporte</option>
        <option value={'ST'}>ST</option>


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
            <option key={cli.label} value={cli.label
            }>
              {cli.label}
            </option>
          );
        })}

      </Form.Select>
    );
  }

  const modalSetParametrizacion = (row: any) => {

    setlabelsinEditar(row.label);
    settipo(row.tipo);
    setlabel(row.label);
    setvalor(row.valor);
    setflujo(row.flujo);
    showModals();
  }


  const setRequerimientos = (tipoModificacion: any, labelEditar?: any) => {

    let parametrosRequerimientos: any = {};
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

    parametrosRequerimientos = {
      tipo,
      label,
      valor,
      flujo
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
        setConfiguracion('1', '[' + JSON.stringify(parametrosRequerimientos) + ']', '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
          successDialog("Operación Éxitosa", "");
          setData([...Data, JSON.parse(JSON.stringify(parametrosRequerimientos))] as any[]);
          settipo("");
          setflujo("");
          setlabel("");
          setvalor("");
        }).catch((error) => {
          errorDialog("<i>Error comuniquese con el adminisrador<i/>", "");
        });
      }
      else if (tipoModificacion == "2" || tipoModificacion == "3"){
        let conf = Data.filter(lis => lis.label != (tipoModificacion == "2" ? labelsinEditar: labelEditar));
        

        parametrosRequerimientos = {
          tipo,
          label,
          valor,
          flujo
        };

        if (tipoModificacion == "2")
        conf.push(parametrosRequerimientos);
       
     

        setConfiguracion('1', JSON.stringify(conf), '[' + JSON.stringify(movimientos) + ']', tipoModificacion).then((response) => {
          successDialog("Operación Éxitosa", "");
          setData(JSON.parse(JSON.stringify(conf)) as any[]);
          settipo("");
          setflujo("");
          setlabel("");
          setvalor("");
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
                          modalSetParametrizacion(row.original);
                      }}
                      >
                        <Update />
                      </IconButton>
                    </Tooltip>

                    <Tooltip arrow placement="left" title="eliminar">
                      <IconButton
                        onClick={() => {
                          setRequerimientos("3", row.original.label);
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
            setRequerimientos("1", null);
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
          <Modal.Title>{tituloModalParametrizacion}</Modal.Title>
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
        <Modal.Footer>
          <Button type="button" variant="primary" onClick={() => {
            setRequerimientos("2", null);
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
