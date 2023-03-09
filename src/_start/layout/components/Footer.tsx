/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useTheme } from "../core";

export function Footer() {
  const { classes } = useTheme();
  return (

    <div className={`footer py-0 d-flex flex-lg-column`} id="kt_footer">
        {/*  <img
                alt="Logo"
                src={toAbsoluteUrl("/media/syscaf/Syscafimg/Footer.png")}
                style={{ width: '100%', height: 45 }}
              /> */}
      {/* begin::Container */}
      <div
        className={`${classes.footerContainer} d-flex flex-column flex-md-row align-items-center justify-content-between`}
      >
        {/* begin::Copyright */}
        <div className="text-dark order-2 order-md-1">
          <span className="text-muted fw-bold me-2">
            {new Date().getFullYear()} &copy;
          </span>
          <a href="#" className="text-gray-800 text-hover-primary">
            SYSCAF SAS  -  Conectamos Datos con Oportunidades
          </a>
        </div>
        {/* end::Copyright */}

        {/* begin::Nav */}
        <ul className="menu menu-gray-600 menu-hover-primary fw-bold order-1">
          {/* <li className="menu-item">
            <a href="#" className="menu-link ps-0 pe-2">
              Sonre Nosotros
            </a>
          </li> */}
          <li className="menu-item">
            <a href="#" className="menu-link pe-0 pe-2">
              Contactenos
            </a>
          </li>
          {/* <li className="menu-item">
            <a href="#" className="menu-link pe-0">
              Purchase
            </a>
          </li> */}
        </ul>
        {/* end::Nav */}
      </div>
      {/* end::Container */}
    </div>
  );
}
