/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from "react";
import { Carousel } from "bootstrap";
import { datosFatigue, dataGeneral } from "../dataFatigue";

type Props = {
  className: string;
  innerPadding?: string;
};

const IndicadorPanelGeneral: React.FC<Props> = ({ className, innerPadding = "" }) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const element = carouselRef.current;
    if (!element) {
      return;
    }

    const carousel = new Carousel(element);
    return function cleanUp() {
      carousel.dispose();
    };
  }, []);

  // traemos la informacion dummy
  let indicadoresCriticidad = datosFatigue.getTotalPorCriticidad();

  return (
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

                return (

                  <div className={`carousel-item ${(index == 0) && "active"}`}>
                    <div className="flex-grow-1">
                      <h3 className="fs-3 text-gray-800 text-hover-primary fw-bolder cursor-pointer">
                        {`${element[0]}(${element[1]})`}
                      </h3>
                      <div className="row">
                        {
                          dataGeneral.filter((f) => {

                            return (f["Alerta"] == element[0] && f.Estado == "Operando")
                          }).slice(0, 8).map((m) => {

                            return (
                            
                                <p className= {`text-gray-800  fw-bolder col-xl-3 fs-9 bg-light-${m["color"]} m-1`}> {m.RegistrationNumber} </p>
                              
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
  );
};

export { IndicadorPanelGeneral };
