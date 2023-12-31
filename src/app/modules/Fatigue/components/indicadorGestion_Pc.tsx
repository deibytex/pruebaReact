/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDataFatigue } from "../core/provider";

type Props = {
  className: string;
  innerPadding?: string;
};

const IndicadorGestion: React.FC<Props> = ({ className, innerPadding = "" }) => {
  const { alertas } = useDataFatigue();

  const [totalAlertas, settotalAlertas] = useState(0);
  const [totalAlertasSinGestion, settotalAlertasSinGestion] = useState(0);

  useEffect(() => {

    let alertasCriticas = (alertas).filter((est: any) => est.Criticidad == "Riesgo alto");
    settotalAlertas(alertasCriticas.length);

    let filtersingestion = (alertasCriticas).filter((est: any) => est.EstadoGestion == null);

    settotalAlertasSinGestion(filtersingestion.length);
  }, [alertas])


  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className={`card-body ${innerPadding}`}>
        {/* begin::Section */}
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          {/* <div className="symbol symbol-50px me-5">
            <span className="symbol-label bg-light-danger">
              <KTSVG
                path="/media/icons/duotone/Home/Library.svg"
                className="svg-icon-2x svg-icon-danger"
              />
            </span>
          </div> */}
          {/* end::Symbol */}

          {/* begin::Title */}
          <div>
            
            <div className="text-gray-700 fw-bolder fs-7 mt-3 text-center">Alertas Críticas sin Gestionar</div>
          </div>
          {/* end::Title */}
        </div>
        {/* end::Section */}

        {/* begin::Info */}
        <div className="d-flex justify-content-around mt-10 mb-10">
        {/* begin::Dropdown */}
        <div
          className="btn btn-icon btn-lg btn-light-danger fw-bolder pulse pulse-danger mt-3"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          <span className="position-absolute fs-1">{`${totalAlertasSinGestion}/${totalAlertas}`}</span>
          <span className="pulse-ring"></span>
        </div>
      
        {/* end::Dropdown */}
      </div>
        {/* end::Info */}

        {/* begin::Progress */}
        <div className="progress h-6px  bg-light-danger mt-7">
          <div
            className="progress-bar bg-danger"
            role="progressbar"
            style={{ width: "80%" }}
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        {/* end::Progress */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { IndicadorGestion };
