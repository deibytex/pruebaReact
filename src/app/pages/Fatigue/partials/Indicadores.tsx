/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { KTSVG } from "../../../../_start/helpers";
import { Content } from "../../../../_start/layout/components/Content";
import { Titulosubtitulo } from "./titlesIndicadores";


type Props = {
  className: string;
  innerPadding?: string;
  pathIcon? : string;
  titulo : string;
  subtitulo? : string;
};

const BaseIndicador: React.FC<Props> = ({children , className, innerPadding = "",  pathIcon = "", titulo,subtitulo= "" }) => {
  return (
    <div className={`card  ${className}`}>
      {/* begin::Body */}
     
        {/* begin::Section */}
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          
             {/*SI TIENE ICONO SE LO COLOCAMOS*/(pathIcon != "") && (<div className="symbol symbol-50px me-5">
            <span className="symbol-label bg-white bg-opacity-10"><KTSVG
                className="svg-icon-2x svg-icon-white"
                path={pathIcon}
              />    </span>
              </div>)}
              
        
          {/* end::Symbol */}

          {/* begin::Title */}         
          <Titulosubtitulo titulo={titulo}  subtitulo={subtitulo} />          
          {/* end::Title */}
        </div>
        {/* end::Section */}

        {/* begin::Info */}
        <div className="fw-bolder text-white ">
       {children}
        </div>
        {/* end::Info */}

       
     
      {/* end::Body */}
    </div>
  );
};

export { BaseIndicador };
