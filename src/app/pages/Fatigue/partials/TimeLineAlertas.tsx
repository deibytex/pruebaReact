/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { KTSVG } from "../../../../_start/helpers";
import { Dropdown1 } from "../../../../_start/partials";
import { datosFatigue } from "../dataFatigue";


type Props = {
    className: string;
};
let arrayTotal: [] = [];
const TimeLineAlertas: React.FC<Props> = ({ className }) => {

    let dataConAlertas = datosFatigue.getTimeLine();
    dataConAlertas.filter((m) => {
        return (m.Estado == "Operando" && m["Alertas"].length > 0);
    }).map((m) => {
        Array.prototype.push.apply(arrayTotal, m["Alertas"]);
        return m["Alertas"];
    });

    let primeros15 = arrayTotal.slice(0, 8);
    return (
        <div className={`card ${className}`}>
            {/* begin::Header */}
            <div className="card-header align-items-center border-0 mt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="fw-bolder text-dark fs-3">Linea Tiempo</span>
                    <span className="text-muted mt-2 fw-bold fs-6">
                        Notificationes
                    </span>
                </h3>
                {/*  <div className="card-toolbar">
          begin::Dropdown 
          <button
            type="button"
            className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            <KTSVG
              path="/media/icons/duotone/Layout/Layout-4-blocks-2.svg"
              className="svg-icon-1"
            />
          </button>
          <Dropdown1 />
         end::Dropdown 
        </div>*/}
            </div>
            {/* end::Header */}

            {/* begin::Body */}
            <div className="card-body pt-3">
                {/* <begin::Timeline */}
                <div className="timeline-label">

                    {

                        primeros15.map((m) => {
                              
                            return (
                                <div className="timeline-item">
                                    {/* begin::Label */}
                                    <div className="timeline-label fw-bolder text-gray-800 fs-6">
                                      {m["hora"]}
                                    </div>
                                    {/* end::Label */}

                                    {/* begin::Badge */}
                                    <div className="timeline-badge">
                                        <i className="fa fa-genderless text-success fs-1"></i>
                                    </div>
                                    {/* end::Badge */}

                                    {/* begin::Content */}
                                    <div className="timeline-content d-flex">
                                        <span className="fw-bolder text-gray-800 ps-3">{m["vehiculo"]}</span>
                                        <span className="fw-bolder text-danger ps-2">{m["alerta"]}</span>                                        
                                    </div>
                                    {/* end::Content */}
                                </div>
                            )

                        })
                    }
                </div>
                {/* <end::Timeline */}
            </div>

            {/* <end: Card Body */}
        </div>
    );
};

export { TimeLineAlertas };
