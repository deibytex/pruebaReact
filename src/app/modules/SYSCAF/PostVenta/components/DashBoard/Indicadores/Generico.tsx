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
    return(
        <div className="pt-5">
            <div className= {`d-flex ${className} card-rounded flex-grow-1`}>
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