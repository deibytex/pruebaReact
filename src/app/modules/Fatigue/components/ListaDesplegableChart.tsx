/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

export function ListaDesplegableChart() {
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content fs-6 text-dark fw-bolder px-3 py-4">
          Tipo Datos
        </div>
      </div>

      <div className="separator mb-3 opacity-75"></div>

      <div className="menu-item px-3">
        <a href="#" className="menu-link px-3">
          Ver por Eventos
        </a>
      </div>

      <div className="menu-item px-3">
        <a href="#" className="menu-link px-3">
          Ver por Alertas
        </a>
      </div>

    </div>
  );
}
