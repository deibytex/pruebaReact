import { Button, Card, Nav, Tab, Tabs } from "react-bootstrap-v5";
import { string } from "yup";
import { eventos } from "../dataFatigue";
import { v4 as uuid } from 'uuid';
import Moment from 'moment';
import { useState } from "react";
import moment from "moment";
type CardOptions =
    {
        titulo: string;

    }


export default function CardContainerEventos() {


    const [dataAlertas, setDataAlertas] = useState<any[]>(eventos);

    // funcion para cambiar el estado
    // de ver detalles para que se renderice el tab de ver mas
    function setDetails(id: string) {
        let datafiltrada = dataAlertas.map((item) => {
            if (item["EventId"] == id)
                return { ...item, esVisibleTabs: !item["esVisibleTabs"] };
            return item;
        });
        setDataAlertas(datafiltrada);
    }

    // gestiona las alertas generadas en el sistyema
    function setGestionar(id: string) {
        // colocar su url axiox aqui
        let datafiltrada = dataAlertas.map((item) => {
            if (item["EventId"] == id)
                return { ...item, EsGestionado: 1 };
            return item;
        });
        setDataAlertas(datafiltrada);
    }
    return (

        <>
            {

                dataAlertas.map((item) => {


                    const mediaurls = JSON.parse(item["MediaUrls"]);

                    const idUnique = item["EventId"];
                    const navID = `nav_${idUnique}`;
                    const bntId = `btn_${idUnique}`;
                    let duration = moment.duration(Moment().diff(item["StartDateTime"]))
                    return (

                        <Card className="border" key={uuid()}>
                            <Card.Body  >
                                <div className="row g-0 g-xl-5 g-xxl-8  bg-light-dark text-dark">
                                    <div className="col-xl-4">
                                        <span> EventId: {item["EventId"]}</span>
                                    </div>
                                    <div className="col-xl-3">
                                        <span> Placa: {item["RegistrationNumber"] }</span>
                                    </div>
                                    <div className="col-xl-4">
                                        <span> Evento: {item["Evento"]}</span>
                                    </div>
                                </div>
                                <div className="row g-0 g-xl-5 g-xxl-8 ">
                                    <div className="col-xl-4">
                                        <span> Operador:  {item["driver"]}</span>
                                    </div>
                                    <div className="col-xl-3">
                                        <span> Fecha: {Moment(item["StartDateTime"]).format('DD/MM/YYYY HH:mm:ss')}</span>
                                    </div>
                                    <div className="col-xl-2">
                                        <span> Duracion: {item["TotalTimeSeconds"]}</span>
                                    </div>
                                    <div className="col-xl-2">
                                        <span> Velocidad: {item["SpeedKilometresPerHour"]}</span>
                                    </div>
                                    <div className="col-xl-1">
                                        <span> Edad: {Moment(duration.asMilliseconds()).format("HH:mm")}</span>
                                    </div>
                                </div>
                                
                                <div className="row g-0 g-xl-5 g-xxl-8">
                                    <div className="col-xl-3">
                                        <Button id={bntId} className="btn-sm" variant="primary" value={bntId} onClick={(e) => {
                                            setDetails(idUnique);
                                        }} >{
                                                (!item["esVisibleTabs"]) && ("Ver Detalles")

                                            }{
                                                (item["esVisibleTabs"]) && ("Cerrar Detalles")
                                            }</Button>
                                    </div>
                                    <div className="col-xl-3">
                                        {
                                            (item["EsGestionado"] == 1) && (
                                                <span className="text-primary"> Gestionado</span>
                                            )
                                        }
                                        {
                                            (item["EsGestionado"] != 1) && (
                                                <Button className="btn-sm" variant="danger" onClick={(e) => {
                                                    setGestionar(idUnique)
                                                }} >Gestionar</Button>
                                            )
                                        }
                                    </div>
                                </div>

                                {
                                    (item["esVisibleTabs"]) && (
                                        <Tabs
                                            defaultActiveKey="videos"
                                            className="mb-3 border"
                                            justify
                                        >
                                            <Tab eventKey="videos" title={`Videos (${Object.entries(mediaurls).length})`}>
                                                <span>
                                                    
                                            {
                                                     Object.entries(mediaurls).map((element, index) => {

                                                        return (
                                                            <a
                                                            className={`nav-link btn btn-active-light btn-color-muted py-2 px-4 fw-bolder me-2`}
                                                            target="_blank"
                                                            href={element[1] as string}
                                                            
                                                          >
                                                            {element[0]}
                                                          </a>
                                                        )
                                                     })
                                                }</span>
                                            </Tab>
                                            <Tab eventKey="localizacion" title="Localizacion">
                                                <span>NO HAY INFORMACION DISPONIBLE</span>
                                            </Tab>
                                            <Tab eventKey="detalles" title="Detalles">
                                                <span>NO HAY INFORMACION DISPONIBLE</span>
                                            </Tab>

                                        </Tabs>)
                                }



                            </Card.Body>
                        </Card>


                    )

                })
            }
        </>
    );
}


