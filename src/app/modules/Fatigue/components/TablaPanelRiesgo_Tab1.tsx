/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { datosFatigue, dataGeneral } from "../dataFatigue";
import "rsuite/dist/rsuite.min.css";
import { Button, Popover, Whisper } from "rsuite";
import { useDataFatigue } from "../core/provider";
import _ from "lodash";
import { Box, Typography } from "@mui/material";


type Props = {
  className: string;
  innerPadding?: string;
};

const FAG_TablaPanelRiesgo: React.FC<Props> = ({ className, innerPadding = "" }) => {
  const { listadoEventosActivos, ListadoVehiculoSinOperacion } = useDataFatigue();
  const [indicadoresCriticidad, setIndicadoresCriticidad] = useState<any>({});

  useEffect(() => {
    setIndicadoresCriticidad(datosFatigue.getTotalPorCriticidad(listadoEventosActivos ?? [], ListadoVehiculoSinOperacion));
   
  }, [listadoEventosActivos, ListadoVehiculoSinOperacion]);

  const contenidoPopUp = (title: string, body: any | undefined | null) => {
    if (body == null || body == undefined)
      body = [];
    return (
      <Popover title={title}>
        <h3>Eventos Identificados </h3>

        <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >

          {Object.entries(body).map((elemento) => {

            return (
              <>
                <Typography>
                  {elemento[0]}</Typography>
                <Typography> {`: (${(elemento[1] as any[]).length})`}</Typography>
              </>
            )
          })}

        </Box>
      </Popover>
    )
  };
  return (<>
  
   {(JSON.stringify(indicadoresCriticidad)  != '{}') && (


    <div className={`card ${className}`}>

      {/* begin::Header */}
      <div className={`card-header border-0 pt-5 ${innerPadding}`}>
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder text-dark fs-3">
            Panel de Riesgo
          </span>
          <span className="text-muted mt-2 fw-bold fs-6">{`Total Eventos (${indicadoresCriticidad.TotalAlertasFlota})`}</span>
        </h3>
        <div className="card-toolbar">
          <ul className="nav nav-pills nav-pills-sm nav-light">

            {
              Object.entries(indicadoresCriticidad.operandoDivididos).map((element, index) => {

                return (
                  <li className="nav-item" key={`itemtablapanel_${(element[1] as any[]).length}-${element[0]}`}>
                    <a
                      className={`nav-link btn btn-active-light btn-color-muted py-2 px-4 fw-bolder me-2 ${(index == 0) && "active"}`}
                      data-bs-toggle="tab"
                      href={`#kt_tab_pane_2_${index + 1}`}
                    >
                      {`${element[0]}(${(element[1] as any[]).length})`}
                    </a>
                  </li>

                )
              })

            }
          </ul>
        </div>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body pt-3 pb-0 mt-n3">
        <div className="tab-content mt-4" id="myTabTables2">

          {
            Object.entries(indicadoresCriticidad.operandoDivididos).map((itemcritico, index) => {
              let totalElements = (itemcritico[1] as any[]).length;
              let elementosPorNivel = itemcritico[1] as any[];
              let dividido = Math.trunc(totalElements / 6) + 1; // total de columnas 
              return (
                <div
                  key={`tabpanel_${index + 1}`}
                  id={`kt_tab_pane_2_${index + 1}`}
                  role="tabpanel"
                  aria-labelledby={`kt_tab_pane_2_${index + 1}`}
                  className={`tab-pane fade active ${(index == 0) && "show"}`}
                >

                  <div  key={index+1} className="table-responsive">
                    <table key={index+2} className="table table-borderless align-middle">
                      <thead>
                        <tr key={index+3}>
                          <th className="p-0 min-w-50px"></th>
                          <th className="p-0 min-w-50px"></th>
                          <th className="p-0 min-w-50px"></th>
                          <th className="p-0 min-w-50px"></th>
                          <th className="p-0 min-w-50px"></th>
                          <th className="p-0 min-w-50px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          Array.from({ length: dividido }, (v, k) => k + 1).map((element) => {
                            let inicio = (element == 1) ? 0 : 6 * (element - 1);
                            return (
                              <tr key={`tr_tabpanel_${element}`}>{
                                elementosPorNivel.slice(inicio, 6 * element).map((m) => {
                                  let totalEventos = (m.TotalEventos == undefined) ? '' : `(${m.TotalEventos})`;
                                  return (
                                    <td className="px-0" key={`td_tabpanel_${m.RegistrationNumber}`}>
                                      <Whisper
                                        placement="top"
                                        trigger="click"
                                        controlId="control-id-click"
                                        speaker={contenidoPopUp(m.RegistrationNumber, m.EventosAgrupados)}
                                        enterable
                                      >
                                        <Button className={`text-${m["color"]} fw-bolder bg-light-${m["color"]}  text-hover-primary fs-8`} > {`${m.RegistrationNumber} ${totalEventos}`}</Button>
                                      </Whisper>
                                    </td>
                                  )
                                })
                              }
                              </tr>
                            )
                          })

                        }
                      </tbody>
                    </table>
                  </div>

                </div>


              )
            })

          }




        </div>
      </div>
      {/* end::Body */}
    </div>

)}
</> );
};

export { FAG_TablaPanelRiesgo };
