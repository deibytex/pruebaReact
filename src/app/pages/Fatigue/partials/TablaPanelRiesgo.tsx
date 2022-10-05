/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { datosFatigue, dataGeneral } from "../dataFatigue";
import "rsuite/dist/rsuite.min.css";
import { Button, Popover, Whisper } from "rsuite";

type Props = {
  className: string;
  innerPadding?: string;
};

const FAG_TablaPanelRiesgo: React.FC<Props> = ({ className, innerPadding = "" }) => {

  let indicadoresCriticidad = datosFatigue.getTotalPorCriticidad();
  indicadoresCriticidad.operandoDivididos["No Operando"] = 23;

  const contenidoPopUp = (title: string) => { return  (
    <Popover title={title}>
      <p>This is a default Popover </p>
      <p>Content</p>
      <p>
        <a>link</a>
      </p>
    </Popover>
  )
};
  return (
    
    <div className={`card ${className}`}>
   
      {/* begin::Header */}
      <div className={`card-header border-0 pt-5 ${innerPadding}`}>
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder text-dark fs-3">
            Panel de Riesgo
          </span>
          <span className="text-muted mt-2 fw-bold fs-6">{`Total Flota (${indicadoresCriticidad.TotalAlertasFlota})`}</span>
        </h3>
        <div className="card-toolbar">
          <ul className="nav nav-pills nav-pills-sm nav-light">

            {
              Object.entries(indicadoresCriticidad.operandoDivididos).map((element, index) => {

                return (
                  <li className="nav-item">
                    <a
                      className={`nav-link btn btn-active-light btn-color-muted py-2 px-4 fw-bolder me-2 ${(index == 0) && "active"}`}
                      data-bs-toggle="tab"
                      href={`#kt_tab_pane_2_${index + 1}`}
                    >
                      {`${element[0]}(${element[1]})`}
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
              let totalElements = itemcritico[1] as number;
              let dividido = Math.trunc(totalElements / 6) + 1; // total de columnas 
              return (
                <div
                  id={`kt_tab_pane_2_${index + 1}`}
                  role="tabpanel"
                  aria-labelledby={`kt_tab_pane_2_${index + 1}`}
                  className={`tab-pane fade active ${(index == 0) && "show"}`}
                >

                  <div className="table-responsive">
                    <table className="table table-borderless align-middle">
                      <thead>
                        <tr>
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
                              <tr>
                                {

                                  dataGeneral.filter((f) => {

                                    return (f["Alerta"] == itemcritico[0] && f.Estado == "Operando")
                                  }).slice(inicio, 6 * element).map((m) => {

                                    return (
                                      <td className="px-0">

                                        <Whisper                                        
                                                placement="top"
                                                trigger="click"
                                                controlId="control-id-click"
                                                speaker={contenidoPopUp(m.RegistrationNumber)}
                                                enterable
                                              >
                                                <Button className={`text-${m["color"]} fw-bolder bg-light-${m["color"]}  text-hover-primary fs-8`} > {m.RegistrationNumber}</Button>
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
  );
};

export { FAG_TablaPanelRiesgo };
