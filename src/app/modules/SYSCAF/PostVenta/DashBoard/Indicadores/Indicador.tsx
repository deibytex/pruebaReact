import { KTSVG } from "../../../../../../_start/helpers";

type Props = {
    Titulo: string;
    Subtitulo : string;
    className: string;
    innerPadding?: string;
    color?: string;
    path?:string;
    colorPath?:string;
}

export const Indicador : React.FC<Props> = ({children , Titulo, Subtitulo, className, innerPadding = "", color ="primary", path="/media/icons/duotone/Home/Library.svg", colorPath=""}) => {

    return (
        <div className={`card ${className}`}>
          {/* begin::Body */}
          <div  className={`card-body ${innerPadding}`}>
            {/* begin::Section */}
            <div  className="d-flex align-items-center">
              {/* begin::Symbol */}
              <div className="symbol symbol-50px me-5">
                <span className={`symbol-label ${colorPath}`}>
                  <KTSVG
                    path={path}
                    className="svg-icon-2x svg-icon-success"
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
                  {Titulo}
                </a>
                <div className="fs-7 text-muted fw-bold mt-1">{Subtitulo}</div>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Section */}
    
            {/* begin::Info */}
            {/* Para el tamaño fijo y no solo eso sino que la linea de cargando quede el mismo nivel */}
            <div className="fw-bolder text-muted pt-7 text-center" style={{height:'143px', maxHeight:'143px'}}>
              {children}
            </div>
            {/* end::Info */}
    
            {/* begin::Progress */}
            <div className={`progress h-6px  bg-light-${color} mt-7`}>
              <div
                className={`progress-bar bg-${color}`}
                role="progressbar"
                style={{ width: "100%" }}
                aria-valuenow={100}
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