/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { KTSVG } from "../../../../_start/helpers";

type Props = {
  className: string;
  innerPadding?: string;
  alertas?: string;
};

const IndicadorGestion: React.FC<Props> = ({ className, innerPadding = "", alertas = "0/0" }) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className={`card-body ${innerPadding}`}>
        {/* begin::Section */}
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-50px me-5">
            <span className="symbol-label bg-light-danger">
              <KTSVG
                path="/media/icons/duotone/Home/Library.svg"
                className="svg-icon-2x svg-icon-danger"
              />
            </span>
          </div>
          {/* end::Symbol */}

          {/* begin::Title */}
          <div>
            <a
              href="#"
              className="fs-4 text-gray-800 text-hover-primary fw-bolder"
            >
             Alertas sin Gestionar
            </a>
            <div className="fs-7 text-muted fw-bold mt-1"></div>
          </div>
          {/* end::Title */}
        </div>
        {/* end::Section */}

        {/* begin::Info */}
        <div className="d-flex justify-content-around mt-10 mb-10">
        {/* begin::Dropdown */}
        <div
          className="btn btn-icon btn-lg btn-light-danger fw-bolder pulse pulse-danger"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          <span className="position-absolute fs-1">{alertas}</span>
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
