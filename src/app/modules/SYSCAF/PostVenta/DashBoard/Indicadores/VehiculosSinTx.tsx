/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

type Props = {
  className: string;
  innerPadding?: string;
};

export const VehiculosSinTx: React.FC<Props> = ({
  className,
  innerPadding = "",
  children,
}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className={`card-body ${innerPadding}`}>
        {/* begin::Top */}
        <div className="d-flex bg-light-danger card-rounded flex-grow-1">
          {/* begin::Section */}
          <div className="py-10 ps-7">
            {/* begin::Text */}
            <div className="">
              <span className="text-danger d-block mb-n1">Vehículo Crítico</span>
              <span className="font-weight-light fs-1 text-gray-800">
                ABC-123 sin TX {" "}
                <span className="fw-bolder fs-1 text-gray-800">20 días</span>
              </span><br/>
              <span className="font-weight-light fs-1 text-gray-800">
                Tiene Falla de {" "}
                <span className="fw-bolder fs-1 text-gray-800">2/4 Señales</span>
              </span>
            </div>
            {/* end::Text */}
            {children}
          </div>
          {/* end::Section */}

          {/* begin::Pic */}
         
          {/* end::Pic */}
        </div>
        {/* end::Top */}
  {/* begin::Top */}
  <div className="d-flex bg-light-warning card-rounded flex-grow-1">
          {/* begin::Section */}
          <div className="py-10 ps-7">
            {/* begin::Text */}
            <div className="">
              <span className="text-warning d-block mb-n1">Vehículo en riesgo</span>
              <span className="font-weight-light fs-1 text-gray-800">
                ABC-123 sin TX {" "}
                <span className="fw-bolder fs-1 text-gray-800">10 días</span>
              </span><br/>
              <span className="font-weight-light fs-1 text-gray-800">
                Tiene Falla de {" "}
                <span className="fw-bolder fs-1 text-gray-800">1/4 Señales</span>
              </span>
            </div>
            {/* end::Text */}
            {children}
          </div>
          {/* end::Section */}

          {/* begin::Pic */}
         
          {/* end::Pic */}
        </div>
        {/* end::Top */}
        

          {/* begin::Top */}
          <div className="d-flex bg-light-primary card-rounded flex-grow-1">
          {/* begin::Section */}
          <div className="py-10 ps-7">
            {/* begin::Text */}
            <div className="">
              <span className="text-primary d-block mb-n1">Vehículo en riesgo</span>
              <span className="font-weight-light fs-1 text-gray-800">
                ABC-123 sin TX {" "}
                <span className="fw-bolder fs-1 text-gray-800">3 días</span>
              </span><br/>
              <span className="font-weight-light fs-1 text-gray-800">
                Tiene Falla de {" "}
                <span className="fw-bolder fs-1 text-gray-800">0/4 Señales</span>
              </span>
            </div>
            {/* end::Text */}
            {children}
          </div>
          {/* end::Section */}

          {/* begin::Pic */}
         
          {/* end::Pic */}
        </div>
        {/* end::Top */}
      </div>
      {/* end::Body */}
    </div>
  );
};

