import { Button, Modal } from "react-bootstrap-v5";
import { useDataNivelCarga } from "../../core/NivelCargaProvider";
import Nouislider from "nouislider-react";
import { CirclesWithBar, Watch } from "react-loader-spinner";
import { dualListDTO } from "../../models/NivelcargaModels";
import { useEffect, useState } from "react";
import DualListBox from "react-dual-listbox";


const Indicador: React.FC = ({ children }) => {
    return <>{CargarIndicador({ children })}</>
}
const IndicadorCargado: React.FC = ({ children }) => {
    return <>{CargarIndicadorCargado({ children })}</>
}

//para indicar que esta cargando
function CargarIndicador(children: any) {
    const { Visible } = useDataNivelCarga();
    return (
        <> <Watch
            height={30}
            width={30}
            color="#F90E07"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            visible={Visible}

        /></>
    )
}
//para rellenar el espacio de cargado
function CargarIndicadorCargado(children: any) {
    const { Visible } = useDataNivelCarga();
    return (
        <>
            <CirclesWithBar
                height="30"
                width="30"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={!Visible}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel='circles-with-bar-loading'
            /></>
    )
}


const VehiculosFiltros: React.FC = () => {

    const { VehiculosFiltrados, setVehiculosFiltrados, dataTable, setIsFiltrado, MinSocCarga, MaxSocCarga
        , showVehiculos, setShowVehiculos
    } = useDataNivelCarga();
    const [vehiculos, setvehiculos] = useState<dualListDTO[]>([]);

    function Widget() {
        return (
            <DualListBox
                options={vehiculos}
                selected={VehiculosFiltrados}
                onChange={(selected: string[]) => { setVehiculosFiltrados(selected); setIsFiltrado(true); }}
            />
        );
    }

    // llenamos la informacion de vehkiculos basados en la informacion del datatable
    useEffect(() => {
        if (dataTable != undefined && dataTable.length > 0) {
            let dual = dataTable.map((item) => {
                const itemd: dualListDTO = { label: item.placa ?? "", value: item.placa ?? "" };
                return itemd;
            })
            setvehiculos(dual)
        }

    }, [dataTable])


    const cerrarModal = (e: any) => {

        //IsFiltrado
        if (VehiculosFiltrados != undefined)
            setIsFiltrado((VehiculosFiltrados?.length > 0));
        setShowVehiculos(false);

    };

    const cancelar = (e: any) => {

        //IsFiltrado
        setVehiculosFiltrados([])
        if (!(MinSocCarga != 0 || MaxSocCarga != 100))
            setIsFiltrado(false);
        setShowVehiculos(false);
    };


    return (
        <Modal
            show={showVehiculos}
            onHide={cerrarModal}
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{(`Filtro por vehiculos`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        <Widget />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="primary" onClick={cerrarModal}>
                    Filtrar
                </Button>
                <Button type="button" variant="secondary" onClick={cancelar}>
                    Cancelar
                </Button>

            </Modal.Footer>
        </Modal>

    )
};


const SocFiltro: React.FC = () => {
    const { MinSocCarga, MaxSocCarga, setMaxSocCarga, setMinSocCarga, setIsFiltrado, setShowSoc, ShowSoc } = useDataNivelCarga();

    const End = (a: any) => {

        setMinSocCarga(Number.parseInt(a[0]))
        setMaxSocCarga(Number.parseInt(a[1]))
    }
    const handleClose = (e: any) => {
        setIsFiltrado((MinSocCarga != 0 || MaxSocCarga != 100));
        setShowSoc(false);
    };


    function Slider() {
        return (
            <Nouislider range={{
                min: [0],
                max: [100]
            }} start={[MinSocCarga ?? 0, MaxSocCarga ?? 100]} tooltips={true} onSet={End} />
        )
    }

    return (
        <>  <Modal
            show={ShowSoc}
            onHide={handleClose}
            size="sm">
            <Modal.Header closeButton style={{ height: '20px' }}>
                <Modal.Title>{"Soc"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                        {/* <div className="dropright" id="ventanaSoc" style={{transform: 'translate3d(110px, -85px, 0px) !important'}} data-keyboard="false" data-backdrop="static"> */}
                        <div style={{ height: '80px', textAlign: 'center' }}>
                            <div style={{ margin: '7px' }}>
                                <span className="control-label font-weight-bold" style={{ textAlign: 'center', fontSize: '10px' }}>Soc:</span>
                                <div className="row" style={{ width: '100%' }}>
                                    <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                                        <Slider />
                                    </div>
                                </div>
                                <div id="result" style={{ background: 'red' }} />
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </Modal.Body>
        </Modal></>
    )
}

function BotonesFiltros() {
    const { setIsFiltrado, IsFiltrado, setShowSoc, setShowVehiculos, setMinSocCarga, setMaxSocCarga, setVehiculosFiltrados } = useDataNivelCarga()


    const AbrirModalVehiculos = () => {

        setShowVehiculos(true);
        // (IsFiltrado == false ? setIsFiltrado(true):setIsFiltrado(false));
    }

    const AbrirModalSoc = () => {
        setShowSoc(true);
    }
    const QuitarFiltros = () => {

        setIsFiltrado(false);
        setMinSocCarga(0);
        setMaxSocCarga(100);
        setVehiculosFiltrados([]);
    }
    return (
        <>
            <button type="button" title="Soc" className="btn btn-sm btn-primary" onClick={AbrirModalSoc}><i className="bi-battery-charging" ></i></button>
            {<>&nbsp;</>}
            <button type="button" title="Vehiculos" className="btn btn-sm btn-info" onClick={AbrirModalVehiculos}><i className="bi-car-front-fill" ></i></button>
            {<>&nbsp;</>}

            <button style={{ display: `${IsFiltrado == false ? 'none' : 'inline'}` }} type="button" title="Quitar filtros" className="btn btn-sm btn-danger" onClick={QuitarFiltros}><i className="bi-filter" >{(IsFiltrado == true ? <span>&times;</span> : "")}</i></button>
        </>
    )
}

export {  Indicador, IndicadorCargado, VehiculosFiltros, SocFiltro, BotonesFiltros }