/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { KTSVG, toAbsoluteUrl } from "../../../../_start/helpers";
import { datosFatigue, dataGeneral } from "../dataFatigue";

type Props = {
  className: string;
  innerPadding?: string;
};

const FAG_TablaPanelRiesgo: React.FC<Props> = ({ className, innerPadding = "" }) => {

    let indicadoresCriticidad =  datosFatigue.getTotalPorCriticidad();   
    indicadoresCriticidad.operandoDivididos["No Operando"]=23;
    

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className={`card-header border-0 pt-5 ${innerPadding}`}>
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bolder text-dark fs-3">
            Panel de Riesgo 
          </span>
          <span className="text-muted mt-2 fw-bold fs-6">{ `Total Flota (${indicadoresCriticidad.TotalAlertasFlota})`}</span>
        </h3>
        <div className="card-toolbar">
          <ul className="nav nav-pills nav-pills-sm nav-light">

            {
               Object.entries(indicadoresCriticidad.operandoDivididos).map((element, index) => {

                        return (
                            <li className="nav-item">
                            <a
                              className={`nav-link btn btn-active-light btn-color-muted py-2 px-4 fw-bolder me-2 ${ (index == 0) && "active" }`}
                              data-bs-toggle="tab"
                              href= {`#kt_tab_pane_2_${index +1}`}
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
          {/* begin::Tap pane */}
          <div
            id="kt_tab_pane_2_1"
            role="tabpanel"
            aria-labelledby="kt_tab_pane_2_1"
            className="tab-pane fade active show"
          >
            {/* begin::Table */}
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
        
               Object.entries({Critico:9}).map((itemcritico, index) => {
               
                    let totalElements  =  itemcritico[1] as number;
                    let dividido  = Math.trunc(totalElements / 6) +1; // total de columnas 
                    
                   return Array.from({length:dividido},(v,k)=>k+1).map((element) => {
                            let inicio = (element == 1) ? 0: 6* (element-1);
                          
                        return (
                            <tr>
                                {
                                    

                                     dataGeneral.filter( (f) => {
                                        
                                        return (f["Alerta"] == itemcritico[0] && f.Estado == "Operando")
                                     }).slice(inicio,  6* element).map((m) => {
                                       
                                                    return (
                                                        <td className="px-0">
                                                        <a className="text-gray-800 fw-bolder text-hover-primary fs-6">
                                                         {m.RegistrationNumber}
                                                        </a>
                                                        <span className="text-muted fw-bold d-block mt-1">
                                                          Alertas { m.TotalAlertas}
                                                        </span>
                                                      </td>
                                                    )

                                         
                                     })  

                                }
                            </tr>
                        )
                    });
                  
               })

               }
                </tbody>
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}

          {/* begin::Tap pane */}
          <div
            id="kt_tab_pane_2_2"
            role="tabpanel"
            aria-labelledby="kt_tab_pane_2_2"
            className="tab-pane fade"
          >
            {/* begin::Table */}
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
        
        Object.entries({Elevado:6}).map((itemcritico, index) => {
        
             let totalElements  =  itemcritico[1] as number;
             let dividido  = Math.trunc(totalElements / 6) +1; // total de columnas 
             
            return Array.from({length:dividido},(v,k)=>k+1).map((element) => {
                     let inicio = (element == 1) ? 0: 6* (element-1);
                  
                 return (
                     <tr>
                         {
                             

                              dataGeneral.filter( (f) => {
                                 
                                 return (f["Alerta"] == itemcritico[0] && f.Estado == "Operando")
                              }).slice(inicio,  6* element).map((m) => {
                                
                                             return (
                                                 <td className="px-0">
                                                 <a className="text-gray-800 fw-bolder text-hover-primary fs-6">
                                                  {m.RegistrationNumber}
                                                 </a>
                                                 <span className="text-muted fw-bold d-block mt-1">
                                                   Alertas { m.TotalAlertas}
                                                 </span>
                                               </td>
                                             )

                                  
                              })  

                         }
                     </tr>
                 )
             });
           
        })

        }
                </tbody>
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}

          {/* begin::Tap pane */}
          <div
            id="kt_tab_pane_2_3"
            role="tabpanel"
            aria-labelledby="kt_tab_pane_2_3"
            className="tab-pane fade"
          >
            {/* begin::Table */}
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
        
        Object.entries({Normal:5}).map((itemcritico, index) => {
        
             let totalElements  =  itemcritico[1] as number;
             let dividido  = Math.trunc(totalElements / 6) +1; // total de columnas 
             
            return Array.from({length:dividido},(v,k)=>k+1).map((element) => {
                     let inicio = (element == 1) ? 0: 6* (element-1);
                  
                 return (
                     <tr>
                         {
                             

                              dataGeneral.filter( (f) => {
                                 
                                 return (f["Alerta"] == itemcritico[0] && f.Estado == "Operando")
                              }).slice(inicio,  6* element).map((m) => {
                                
                                             return (
                                                 <td className="px-0">
                                                 <a className="text-gray-800 fw-bolder text-hover-primary fs-6">
                                                  {m.RegistrationNumber}
                                                 </a>
                                                 <span className="text-muted fw-bold d-block mt-1">
                                                   Alertas { m.TotalAlertas}
                                                 </span>
                                               </td>
                                             )

                                  
                              })  

                         }
                     </tr>
                 )
             });
           
        })

        }
                </tbody>
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
             {/* begin::Tap pane */}
             <div
            id="kt_tab_pane_2_4"
            role="tabpanel"
            aria-labelledby="kt_tab_pane_2_3"
            className="tab-pane fade"
          >
            {/* begin::Table */}
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
        
        Object.entries({"No Operando":23}).map((itemcritico, index) => {
        
             let totalElements  =  itemcritico[1] as number;
             let dividido  = Math.trunc(totalElements / 6) +1; // total de columnas 
             
            return Array.from({length:dividido},(v,k)=>k+1).map((element) => {
                     let inicio = (element == 1) ? 0: 6* (element-1);
                  
                 return (
                     <tr>
                         {
                             

                              dataGeneral.filter( (f) => {
                                 
                                 return (f.Estado == "No Operando")
                              }).slice(inicio,  6* element).map((m) => {
                                
                                             return (
                                                 <td className="px-0">
                                                 <a className="text-gray-800 fw-bolder text-hover-primary fs-6">
                                                  {m.RegistrationNumber}
                                                 </a>
                                                 <span className="text-muted fw-bold d-block mt-1">
                                                  
                                                 </span>
                                               </td>
                                             )

                                  
                              })  

                         }
                     </tr>
                 )
             });
           
        })

        }
                </tbody>
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
        </div>
      </div>
      {/* end::Body */}
    </div>
  );
};

export { FAG_TablaPanelRiesgo };
