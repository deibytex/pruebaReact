/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "bootstrap";
import { datosFatigue } from "../dataFatigue";
import { useDataFatigue } from "../core/provider";

type Props = {
  className: string;
  innerPadding?: string;
};

const IndicadorPanelGeneral: React.FC<Props> = ({ className, innerPadding = "" }) => {
  const { ListadoVehiculoSinOperacion, alertas } = useDataFatigue();
  const [indicadoresCriticidad, setIndicadoresCriticidad] = useState<any>({});

    // console.log('sinoperar', ListadoVehiculoSinOperacion);
    // console.log('alertas', alertas);
 


  const carouselRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIndicadoresCriticidad(datosFatigue.getTotalPorCriticidad(alertas ?? [], ListadoVehiculoSinOperacion));
    const element = carouselRef.current;
    if (!element) {
      return;
    }

    const carousel = new Carousel(element);
    return function cleanUp() {
      carousel.dispose();
    };
  }, [alertas, ListadoVehiculoSinOperacion]);



  return (<>
  
    {(JSON.stringify(indicadoresCriticidad)  != '{}') && (
 
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className={`card-body ${innerPadding}`}>
        <div
          id="kt_stats_widget_9_carousel"
          className="carousel carousel-custom slide"
          data-bs-ride="carousel"
          data-bs-interval="8000"
          ref={carouselRef}
        >
          {/* begin::Top */}
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            {/* begin::Label */}
            <span className="text-muted fw-bolder pe-2">Panel de Riesgo</span>
            {/* end::Label */}

            {/* begin::Carousel Indicators */}
            <ol className="p-0 m-0 carousel-indicators carousel-indicators-dots">
              <li
                data-bs-target="#kt_stats_widget_9_carousel"
                data-bs-slide-to="0"
                className="ms-1 active"
              ></li>
              <li
                data-bs-target="#kt_stats_widget_9_carousel"
                data-bs-slide-to="1"
                className="ms-1"
              ></li>
              <li
                data-bs-target="#kt_stats_widget_9_carousel"
                data-bs-slide-to="2"
                className="ms-1"
              ></li>
            </ol>
            {/* end::Carousel Indicators */}
          </div>
          {/* end::Top */}

          {/* begin::Carousel */}
          <div className="carousel-inner pt-1">


            {
              Object.entries(indicadoresCriticidad.operandoDivididos).map((element, index) => {
                // console.log('a',element[1]);
                // console.log('b',element[0]);
                return (

                  <div className={`carousel-item ${(index == 0) && "active"}`} key={`indicadorpanelgeneral_${(element[1] as any[]).length}-${element[0]}`}>
                    <div className="flex-grow-1">
                      <h3 className="fs-3 text-gray-800 text-hover-primary fw-bolder cursor-pointer">
                        {`${element[0]}(${(element[1] as any[]).length})`}
                      </h3>
                      <div className="row">
                        
                        {
                          //Se hace validación de key
                          ((element[1] as any).length > 0 && (element[1] as any) != undefined) &&
                          (element[1] as any[]).slice(0, 8).map((m) => {
                            // console.log('1',m);
                            
                            return (
                            
                                 
                                <p key={`indicadorpanelgeneralp_${m.RegistrationNumber}`} className= {`text-gray-800  fw-bolder col-xl-3 fs-9 bg-light-${m["color"]} m-1`}> {m.RegistrationNumber} </p>
                              
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>



                )
              })

            }


          </div>
          {/* end::Carousel */}
        </div>
      </div>
      {/* end::Body */}


    </div>
)}
</>
);
};

export { IndicadorPanelGeneral };
