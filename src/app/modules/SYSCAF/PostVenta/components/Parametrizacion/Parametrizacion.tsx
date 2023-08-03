import { useState } from "react";
import { UpdateRequerimientos } from "./modals/modalRequerimientos";
import { UpdateDLP } from "./modals/ModalDLP";
import { UpdateTickets } from "./modals/ModalSeñalesTicket";

export default function Parametrizacion() {


    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [tituloModalParametrizacion, settituloModalParametrizacion] = useState('');
    
    const handleClose = () => {
        settituloModalParametrizacion('');        
        setShow(false);        
    };

    const showModal = () => {
        settituloModalParametrizacion('Parametrizar Requerimientos')
        setShow(true);
    }

    const handleClose2 = () => {
        settituloModalParametrizacion('');        
        setShow2(false);        
    };

    const showModal2 = () => {
        settituloModalParametrizacion('Parametrizar DLP')
        setShow2(true);
    }

    const handleClose3 = () => {
        settituloModalParametrizacion('');        
        setShow3(false);        
    };

    const showModal3 = () => {
        settituloModalParametrizacion('Parametrizar DLP')
        setShow3(true);
    }

    return (
        <>

            <div className="col-lg-12">
                <h3 className="fw-bolder mb-8">Quick Links</h3>
                {/* begin::Row */}
                <div className="row g-5">
                    <div className="col-sm-4">
                        <a
                            onClick={showModal}
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
                        <a onClick={showModal2} className="card card-custom bg-light-warning hoverable shadow-none min-h-125px mb-5">
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
                            onClick={showModal3}
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
            <UpdateRequerimientos show={show} handleClose={handleClose} title={tituloModalParametrizacion} />
            <UpdateDLP show={show2} handleClose={handleClose2} title={tituloModalParametrizacion} />
            <UpdateTickets show={show3} handleClose={handleClose3} title={tituloModalParametrizacion} />
            

        </>
    )
}