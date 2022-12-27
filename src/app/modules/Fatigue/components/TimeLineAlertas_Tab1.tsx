/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import { useDataFatigue } from "../core/provider";
import { EventoActivo } from "../models/EventosActivos";


type Props = {
    className: string;
};
let arrayTotal: EventoActivo[] = [];
const TimeLineAlertas: React.FC<Props> = ({ className }) => {

    const {listadoEventosActivos} = useDataFatigue();
    // creamos el estado que nos permitira reemprimir los datos si estos se han actualizado
     const [ultimosRegistros, setUltimosRegistros] = useState<any[]>([]);
   
  
    // mantenemos actualizado los registrs cuando los datos 
    // generales se actualicen
    useEffect(() =>{
        arrayTotal = [];
        (listadoEventosActivos ?? []).map((m ) => {        
            arrayTotal.push(m);      
        });
        setUltimosRegistros(arrayTotal.slice(0, 8));
    },[listadoEventosActivos])
    return (
        <div className={`card ${className}`}>
            {/* begin::Header */}
            <div className="card-header align-items-center border-0 mt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="fw-bolder text-dark fs-3">Linea Tiempo</span>
                    <span className="text-muted mt-2 fw-bold fs-6">
                        Últimas Eventos Generados
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
                        ultimosRegistros.map((m) => {
                              
                            return (
                                <div className="timeline-item"  key={`timeline_${uuid()}`}>
                                    {/* begin::Label */}
                                    <div className="timeline-label fw-bolder text-gray-800 fs-6">
                                      {moment(m.EventDateTime).format("DD HH:mm")}
                                    </div>
                                    {/* end::Label */}

                                    {/* begin::Badge */}
                                    <div className="timeline-badge">
                                        <i className="fa fa-genderless text-success fs-1"></i>
                                    </div>
                                    {/* end::Badge */}

                                    {/* begin::Content */}
                                    <div className="timeline-content d-flex">
                                        <span className="fw-bolder text-gray-800 ps-3">{m.registrationnumber}</span>
                                        <span className="fw-bolder text-danger ps-2">{m.descriptionevent}</span>                                        
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
