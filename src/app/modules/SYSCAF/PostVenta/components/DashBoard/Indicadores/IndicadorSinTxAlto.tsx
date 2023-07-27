type Props = {
    className: string;
    innerPadding?: string;
    placa:string;
    dias:string;
    fallas:string;
    TotalFallas:string;
  };
export const IndicadorSinTxAlto: React.FC<Props> = ({
    className,
    innerPadding = "",
    placa,
    children,
    dias,
    fallas,
    TotalFallas
  }) => {
    return(
        <div className="pt-5">
            <div className="d-flex bg-light-danger card-rounded flex-grow-1">
                {/* begin::Section */}
                <div className="py-10 ps-7">
                    <div className="">
                        <span className="text-danger d-block mb-n1">Vehículo Crítico</span>
                        <span className="font-weight-light fs-3 text-gray-800">
                            {placa} sin TX
                            <span className="fw-bolder fs-3 text-gray-800"> {(dias == undefined ? 0 : dias)} días</span>
                        </span><br />
                        {
                            (fallas == null || fallas == "" || fallas == undefined ?"":
                            <span className="font-weight-light fs-3 text-gray-800">
                            Tiene Falla de
                            <span className="fw-bolder fs-3 text-gray-800"> {fallas}/{TotalFallas} Señales</span>
                            </span>
                            )
                        }
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
  }