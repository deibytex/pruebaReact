import { useEffect, useState } from "react";
import { KTSVG } from "../../../../../_start/helpers";
import { Indicador } from "./Indicadores/Indicador";
import { VehiculosSinTx } from "./Indicadores/VehiculosSinTx";
import { GetInfoDashBoardAdmin } from "../data/PostVentaData";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../setup";
import { UserModelSyscaf } from "../../../auth/models/UserModel";
import { locateFormatPercentNDijitos } from "../../../../../_start/helpers/Helper";

export default function HomePostVenta() {
    const user = useSelector<RootState>(
        ({ auth }) => auth.user
    );
    const vUser = user as UserModelSyscaf;
    const [dataAdmin, setDataAdmin] = useState<any[]>([]);
    const [indicadores, setIndicadores] = useState<any>();
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        setLoader(true);
        GetInfoDashBoardAdmin(vUser.Id).then(
            (result) => {
                setDataAdmin(result.data)                
                const data = result.data;
                console.log(data.length)
                if (data.length > 0) {
                    const Assets = JSON.parse(data[0].Assets);
                    const Clientes = JSON.parse(data[0].Clientes);
                    const Conductores = JSON.parse(data[0].Conductores);
                    const VehiculosSinTx = JSON.parse(data[0].VehiculosSinTx);
                    let Indicadores = {
                        Assets: Assets.length,
                        Clientes: Clientes.length,
                        Conductores: Conductores.length,
                        VehiculosSinTx: VehiculosSinTx.length
                    };
                    console.log(Indicadores)
                    setIndicadores(Indicadores);
                }
                setLoader(false);
            }
        ).catch((e) => { console.log("error",e) });
        return () => {
            setDataAdmin([]);
        }
    }, [])
    return (<>
        <div className="row g-0 g-xl-5 g-xxl-8">
            {(indicadores) && (<>
            <div className="col-xl-4">
                <Indicador className="card-stretch mb-5  mb-xxl-8" Titulo={"Total Empresa"} Subtitulo={indicadores.Clientes} >
                    {/* begin::Info */}
                    <div className="fw-bolder text-white pt-7">
                        <span className="d-block">Total Unidades : {indicadores.Assets}</span>
                        <span className="d-block pt-2">Total Conductores: {indicadores.Conductores}</span>
                    </div>
                    {/* end::Info */}
                </Indicador>
            </div>
            <div className="col-xl-4">
                <Indicador className="card-stretch mb-5  mb-xxl-8" Titulo={`Novedades (${indicadores.VehiculosSinTx})`} Subtitulo={"Tx, Señales"} >
                    {/* begin::Info */}
                    <div className="fw-bolder text-muted pt-7 text-center">
                        <div className="container">
                            <div className="row align-items-start">

                                <div className="col">

                                </div>
                                <div className="col">
                                    % Flota
                                </div>
                            </div>
                            <div className="row align-items-start">

                                <div className="col">
                                    Sin Tx: {indicadores.VehiculosSinTx}
                                </div>
                                <div className="col">
                                    {locateFormatPercentNDijitos(indicadores.VehiculosSinTx / indicadores.Assets, 2)}
                                </div>
                            </div>
                            <div className="row align-items-start">

                                <div className="col">
                                    Sin Señales: 0
                                </div>
                                <div className="col">
                                    0 %
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* end::Info */}
                </Indicador>
            </div>

            <div className="col-xl-4">
                <Indicador className="card-stretch mb-5  mb-xxl-8" Titulo={"Tickets"} Subtitulo={"0"} />
            </div>
            </>)
            }
        </div>
      
        {/* begin::Row */}
        <div className="row g-0 g-xl-5 g-xxl-8">
            <div className="col-xxl-4">
                <VehiculosSinTx className="card-stretch mb-5  mb-xxl-8">
                    <a
                        //   onClick={() => setShowCreateAppModal(true)}
                        className="btn btn-secondary btn-sm fw-bolder fs-6 ps-4 mt-6"
                    >
                        Req ST{" "}
                        <KTSVG
                            className="svg-icon-3 me-0"
                            path="/media/icons/duotone/Navigation/Up-right.svg"
                        />
                    </a>
                </VehiculosSinTx>
            </div>

            <div className="col-xxl-8 gy-0 gy-xxl-8">

            </div>
        </div>
        {/* end::Row */}
    </>
    )
}