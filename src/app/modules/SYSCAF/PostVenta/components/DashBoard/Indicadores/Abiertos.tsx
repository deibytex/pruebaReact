type Props = {
    className: string;
    innerPadding?: string;
    indicador:string;
  };
export const Abiertos: React.FC<Props> = ({
    className,
    innerPadding = "",
    indicador,
    children,
  }) => {
    return(
        <div className="pt-5">
            <div className="d-flex bg-light-success card-rounded flex-grow-1">
                {/* begin::Section */}
                <div className="py-5 ps-12">
                    <div className="text-center m-auto">
                        <div className="text-center">
                             <span className="font-weight-light fs-3 text-muted">
                                <span className="fw-bolder fs-3 text-muted">Abiertos</span>
                            </span>
                        </div>
                       <div className="text-center">
                            <span className="font-weight-light fs-3text-muted">
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