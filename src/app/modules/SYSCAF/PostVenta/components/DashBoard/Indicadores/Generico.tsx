type Props = {
    className: string;
    innerPadding?: string;
    texto:string;
    indicador:string;
  };
export const Generico: React.FC<Props> = ({
    className = "bg-light-danger",
    innerPadding = "",
    texto,
    indicador,
    children,
  }) => {
    const Animate = (e:any) =>{
        e.target.style.transform = "scale(1.1)";
        e.target.style.opacity  = "1.1";
        e.target.transition = "opacity 300ms ease-in";
        e.stopPropagation();
    }
    const AnimateOut = (e:any) =>{
        e.stopPropagation();
        e.target.style.transform = "scale(1)";
        e.target.style.opacity  = "1";
        e.target.transition = "opacity 300ms ease-in";
    }
    return(
        <div className="pt-5">
            <div className= {`d-flex ${className} card-rounded flex-grow-1`} onMouseLeave={AnimateOut} onMouseEnter={Animate}>
                {/* begin::Section */}
                <div className="py-5 ps-12">
                    <div className="text-center m-auto">
                        <div className="text-center">
                             <span className="font-weight-light fs-3 text-muted">
                                <span className="fw-bolder fs-3 text-muted">{texto}</span>
                            </span>
                        </div>
                       <div className="text-center">
                            <span className="font-weight-light fs-3 text-muted">
                                <span className="fw-bolder fs-3 text-muted">{indicador}</span>
                            </span>
                       </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
  }