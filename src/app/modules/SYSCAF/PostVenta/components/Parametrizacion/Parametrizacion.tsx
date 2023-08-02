import { useState } from "react";
import { UpdateRequerimientos } from "./modals/modalRequerimientos";

export default function Parametrizacion() {


    const [show, setShow] = useState(false);
    const [tituloModalCorreos, settituloModalCorreos] = useState('');
    
    const handleClose = () => {
        settituloModalCorreos('');        
        setShow(false);        
    };

    const showModal = () => {
        setShow(true);
    }

    return (
        <>

            <div className="col-lg-12">
                <h3 className="fw-bolder mb-8">Quick Links</h3>
                {/* begin::Row */}
                <div className="row g-5">
                    <div className="col-sm-4">
                        <a
                            href="#"
                            className="card card-custom bg-light-primary hoverable shadow-none min-h-125px mb-5"
                        >
                            <div className="card-body d-flex flex-column flex-center text-center">
                                <h3 className="fs-3 mb-2 text-dark fw-bolder">
                                    Requerimientos
                                </h3>
                                <p className="mb-0 text-gray-600">
                                    Parametrización
                                </p>
                            </div>
                        </a>
                    </div>

                    <div className="col-sm-4">
                        <a className="card card-custom bg-light-warning hoverable shadow-none min-h-125px mb-5">
                            <div className="card-body d-flex flex-column flex-center text-center">
                                <h3 className="fs-3 mb-2 text-dark fw-bolder">
                                    DLP
                                </h3>
                                <p className="mb-0 text-gray-600">
                                    Listado
                                </p>
                            </div>
                        </a>
                    </div>
                    <div className="col-sm-4">
                        <a
                            href="#"
                            className="card card-custom bg-light-success hoverable shadow-none min-h-125px mb-5"
                        >
                            <div className="card-body d-flex flex-column flex-center text-center">
                                <h3 className="fs-3 mb-2 text-dark fw-bolder">
                                    Señales y tickets
                                </h3>
                                <p className="mb-0 text-gray-600">
                                    Tiempo
                                </p>
                            </div>
                        </a>
                    </div>
                    {/* end::Row */}
                </div>
            </div>
            <UpdateRequerimientos show={true} handleClose={handleClose} title={tituloModalCorreos} />

        </>
    )
}