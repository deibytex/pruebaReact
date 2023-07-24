import { Stack } from "@mui/material";

import { FechaMomentUtc } from "../../_start/helpers/Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../setup";
import { UserModelSyscaf } from "../modules/auth/models/UserModel";
import HomePostVenta from "../modules/SYSCAF/PostVenta/DashBoard/Dashboard";
import { toAbsoluteUrl } from "../../_start/helpers";

export function Bienvenidos() {
    const user = useSelector<RootState>(
        ({ auth }) => auth.user
    );
    const vUser = user as UserModelSyscaf;
    return <div
        style={{ width: "100%", height: "100%" }}
    >
        <Stack>

            <div className=" d-flex align-items-center justify-content-center text-center m-10 mb-0"
                style={{ width: "100%", height: "100%" }}
            >
                <Stack style={{ width: "100%", height: "100%" }}>
                    <span className="fs-5 text-muted">{FechaMomentUtc().format("dddd, DD [de] MMMM")}</span>
                    <h1 className=" mx-4 fs-3 text-muted"> Hola! {vUser.Nombres} </h1>
                    {/* <HomePostVenta/> */}
                </Stack>
            </div>
            <div className=" d-flex d-flex-column align-items-start justify-content-center m-15 mt-2 "
            >
                <div className="fs-2 text-justify text-primary mt-2" style={{ width: "100%" }} >
                <p className="fs-1 " style={{ width: "100%" }}>
                        Bienvenido a <span className="fw-bold text-syscaf-amarillo">SYSCAF Analytics</span>.
                    </p>
                    <p className="mt-10" style={{ width: "100%" }}>
                        Aquí encontrarás cómo conectar datos de tu flota con oportunidades.
                    </p>
                    <p className="mt-5" style={{ width: "100%", textAlign: "justify" }}> 
                        <span className="fw-bold text-syscaf-amarillo">SYSCAF Analytics</span>  es una plataforma desarrollada con tecnología avanzada en conexiones,
                        procesamiento y visualización de datos para mejorar el desempeño de conductores y de la flota.
                    </p>
                </div>

                     <img
                    alt="Logo"
                    src={toAbsoluteUrl("/media/syscaf/Bienvenida4-1.png")}
                    height="50%"
                    width="50%"
                /> 

            </div>
        </Stack>


    </div>;
}