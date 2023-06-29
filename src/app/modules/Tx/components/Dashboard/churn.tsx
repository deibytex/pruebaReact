import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Modal } from "react-bootstrap-v5";
import { useDataDashboard } from "../../core/DashboardProvider";
import { useEffect, useState } from "react";

type Props = {
  SetShow: (data: boolean) => void;
  Show: boolean;
}
const Churn: React.FC<Props> = ({ SetShow, Show }) => {
  const { DataAcumulado, showChurn, setshowChurn, setCargando } = useDataDashboard();
  const [churnDataEntradas, setChurnDataEntradas] = useState<any[]>([]);
  const [churnDataSalidas, setChurnDataSalidas] = useState<any[]>([])
  const [TotalIn, setTotalIn] = useState<string>("0");
  const [TotalOut, setTotalOut] = useState<string>("0");
  const [TotalResultado, setTotalResultado] = useState<string>("0");
  const [SemanaAnterior, setSemanaAnterior] = useState<string>("");
  const [SemanaActual, setSemanaActual] = useState<string>("");
  //para los acumulado o cruch
  useEffect(() => {
    if (DataAcumulado != undefined && DataAcumulado.length != 0)
      PintarAcumulado2Semanas(DataAcumulado);
  }, [DataAcumulado])

  const PintarAcumulado2Semanas = (DataAcumulado: any[]) => {
    setCargando(true);
    let nuevoObjeto = {}
    //Recorremos el arreglo 
    DataAcumulado.forEach(x => {
      //Si la ciudad no existe en nuevoObjeto entonces
      //la creamos e inicializamos el arreglo de profesionales. 
      if (!nuevoObjeto.hasOwnProperty(x.Fecha)) {
        nuevoObjeto[x.Fecha] = {
          data: []
        }
      }

      //Agregamos los datos de profesionales. 
      if (x.ActivoFacturable == "Si")
        nuevoObjeto[x.Fecha].data.push(
          {
            "ActivoFacturable": x.ActivoFacturable,
            "Base": x.Base,
            "ClienteId": x.ClienteId,
            "Fecha": x.Fecha,
            "Matricula": x.Matricula,
            "Vertical": x.Vertical
          }
        )
    })
    let Semanas = Object.keys(nuevoObjeto);
    let SemanaAnterior = (Semanas.length != 0 ? Semanas[0] : "");
    let SemanaActual = (Semanas.length != 0 ? Semanas[1] : "");
    let DatoSemanaAnterior: any[] = nuevoObjeto[SemanaAnterior].data;
    let DatoSemanaActual: any[] = nuevoObjeto[SemanaActual].data;
    setSemanaAnterior(SemanaAnterior);
    setSemanaActual(SemanaActual);
    // comparar los datos de las 2 semanas
    const dif = DatoSemanaAnterior.length - DatoSemanaActual.length;
    console.log(dif)


    //Los que no estan en la semana actual respecto anterior
    // los que entraron
    let entradas = DatoSemanaActual.filter(function (el) {
      return !(DatoSemanaAnterior.filter((ff) => ff.Matricula === el.Matricula && ff.Base == el.Base).length == 1);
    });
    //filtrar los datos de la semana anterior respecto a la actual
    // los que salieron 
    let salidas = DatoSemanaAnterior.filter(function (el) {
      return !(DatoSemanaActual.filter((ff) => ff.Matricula === el.Matricula && ff.Base == el.Base).length == 1);
    });
    let agrupado = entradas
      .reduce((p, c) => {
        let name = c.Base;
        let isExists = p.filter((f: string) => f === name);
        if (isExists.length == 0)
          p.push(name);

        return p;
      }, []);
    let EntradasPorClientes = entradas.reduce((p, c) => {
      let name = c.Base;
      p[name] = p[name] ?? [];
      p[name].push(c);
      return p;
    }, {});

    let ArrayClientes: any[] = [];
    Object.entries(EntradasPorClientes).forEach((elem: any) => {
      agrupado.forEach((fr: string, index: number) => {
        let name = elem[0];
        let objetomovil = ArrayClientes.filter(f => f.Base === name);
        // si no existe creamos el objeto de la fila a guardar
        let rowMovil = (objetomovil.length == 0) ? {} : objetomovil[0];
        rowMovil["Base"] = name;
        rowMovil["Cantidad"] = elem[1].length;
        if (objetomovil.length == 0) {
          ArrayClientes.push(rowMovil);
        }
      });
    });


    let agrupadoSalidas = salidas
      .reduce((p, c) => {
        let name = c.Base;
        let isExists = p.filter((f: string) => f === name);
        if (isExists.length == 0)
          p.push(name);

        return p;
      }, []);
    let SalidasPorClientes = salidas.reduce((p, c) => {
      let name = c.Base;
      p[name] = p[name] ?? [];
      p[name].push(c);
      return p;
    }, {});

    let ArrayClientesSalidas: any[] = [];
    Object.entries(SalidasPorClientes).forEach((elem: any) => {
      agrupadoSalidas.forEach((fr: string, index: number) => {

        let name = elem[0];
        let objetomovil = ArrayClientesSalidas.filter(f => f.Base === name);
        // si no existe creamos el objeto de la fila a guardar
        let rowMovil = (objetomovil.length == 0) ? {} : objetomovil[0];
        rowMovil["Base"] = name;
        rowMovil["Cantidad"] = elem[1].length;
        if (objetomovil.length == 0) {
          ArrayClientesSalidas.push(rowMovil);
        }
      });
    });

    let ArrayClientesCompletos: any[] = [];

    ArrayClientes.map((val, index) => {
      ArrayClientesSalidas.map((item) => {
        if (val.Base == item.Base) {
          let encontred = ArrayClientesCompletos.findIndex(Element => Element.Base == val.Base);
          if (encontred == -1) {
            ArrayClientesCompletos.push({
              "Base": val.Base,
              "In": val.Cantidad,
              "Out": (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad),
              "Total": (val.Cantidad - (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad))
            })
          } else {
            ArrayClientesCompletos[encontred].In = ArrayClientesCompletos[encontred].In + (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad);
            ArrayClientesCompletos[encontred].Out = ArrayClientesCompletos[encontred].Out + item.Cantidad;
            ArrayClientesCompletos[encontred].Total = ArrayClientesCompletos[encontred].Total + (val.Cantidad - (item.Cantidad == null || item.Cantidad == undefined || item.Cantidad == "" ? 0 : item.Cantidad))
          }
        } else {
          let encontred = ArrayClientesCompletos.findIndex(Element => Element.Base == val.Base);
          if (encontred == -1) {
            ArrayClientesCompletos.push({
              "Base": val.Base,
              "In": val.Cantidad,
              "Out": 0,
              "Total": val.Cantidad
            })
          } else {
            ArrayClientesCompletos[encontred].In = ArrayClientesCompletos[encontred].In + val.Cantidad;
            ArrayClientesCompletos[encontred].Total = ArrayClientesCompletos[encontred].Total + val.Cantidad;
          }
        }
      })
    })
    setChurnDataEntradas(ArrayClientesCompletos);
    setChurnDataSalidas(ArrayClientesSalidas);

    let TotalIn = (
      ArrayClientesCompletos.map((m: any) => {
        return (m.In)
      }).reduce((a: any, b: any) => a + b, 0));
    let TotalOut = (
      ArrayClientesCompletos.map((m: any) => {
        return (m.Out)
      }).reduce((a: any, b: any) => a + b, 0));
    let TotalDierencia = (
      ArrayClientesCompletos.map((m: any) => {
        return (m.Total)
      }).reduce((a: any, b: any) => a + b, 0));

    setTotalIn(TotalIn);
    setTotalOut(TotalOut);
    setTotalResultado(TotalDierencia);
    setCargando(false);
  }
  let DatosColumnasChurnEntradas: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'Base',
      header: 'Cliente',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Base}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'In',
      header: 'In',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.In}</span>)
        return dato;
      }
    },
    {
      accessorKey: 'Out',
      header: 'Out',
      size: 100,
      Cell: ({ cell, column, row, table }) => {
        let dato = (<span title={""} className="">{row.original.Out}</span>)
        return dato;
      }
    },
    // {
    //   accessorKey: 'Total',
    //   header: 'Total',
    //   size: 100
    // }
  ]


  return (
    <Modal show={Show} onHide={SetShow} size={"xl"}>
      <Modal.Header closeButton>
        <Modal.Title>{"CHURN"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 pt-12">
              <div className="card">
                <div className="d-flex justify-content-between mb-2">
                  <div className="mx-auto">
                    <div className="ms-3 text-center">
                      <h3 className="mb-0">{`CHURN ${SemanaAnterior} y ${SemanaActual}`} </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: (churnDataEntradas.length != 0 ? "inline" : "none") }}>
                {(churnDataEntradas.length != 0) && (Show) && (
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
                    muiTableHeadCellProps={{
                      sx: (theme) => ({
                        fontSize: 14,
                        fontStyle: 'bold',
                        color: 'rgb(27, 66, 94)'
                      }),
                    }}
                    columns={DatosColumnasChurnEntradas}
                    data={churnDataEntradas}
                    initialState={{ density: 'compact' }}
                    enableColumnOrdering
                    enableColumnDragging={false}
                    enablePagination={false}
                    enableStickyHeader
                    enableStickyFooter
                    enableDensityToggle={false}
                    enableRowVirtualization
                    // enableRowNumbers
                    enableTableFooter
                    muiTableContainerProps={{ sx: { maxHeight: '300px' } }}
                  />
                )}
                <div className="container" style={{ display: (churnDataEntradas.length != 0 ? "inline" : "none") }}>
                  <div className="row">
                    <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4">
                      <span className="fw-bolder">Total</span>
                    </div>
                    <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4  text-left">
                      <span className="fw-bolder text-end">{TotalIn}</span>
                    </div>
                    <div className="col-sm-4 col-xl-4 col-md-4 col-lg-4  text-left">
                      <span className="fw-bolder text-end">{TotalOut}</span>
                    </div>
                    {/* <div className="col-sm-3 col-xl-3 col-md-3 col-lg-3  text-center">
                  <span className="fw-bolder text-end">{TotalResultado}</span>
                </div> */}
                  </div>
                </div>
              </div>
              <div style={{ display: (churnDataEntradas.length == 0 ? "inline" : "none") }}>
                <div className="card">
                  <div className="d-flex justify-content-between mb-2">
                    <div className="mx-auto">
                      <div className="ms-3 text-center">
                        <span className="text-muted m-3">{`No hay datos que mostrar`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export { Churn }