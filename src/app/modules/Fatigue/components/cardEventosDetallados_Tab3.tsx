import { Button, Card,  Tab, Tabs } from "react-bootstrap-v5";
import { eventos } from "../dataFatigue";
import { v4 as uuid } from 'uuid';
import Moment from 'moment';
import { useEffect, useState } from "react";
import moment from "moment";
import { EventoActivo } from "../models/EventosActivos";
import { useUpdateEffect } from "rsuite/esm/utils";

type Props ={
 data : EventoActivo[];
 isActive : boolean;
 isDetails : boolean;

}

const CardContainerEventos : React.FC<Props> = ({ data , isActive ,isDetails   }) => { 
   
    const [dataAlertas, setDataAlertas] = useState<EventoActivo[]>(data);
    // funcion para cambiar el estado
    // de ver detalles para que se renderice el tab de ver mas
    function setDetails(id: number) {
        
        let datafiltrada = dataAlertas.map((item) => {
            if (item.EventId == id)
                return { ...item, esVisibleTabs: !item["esVisibleTabs"] };
            return item;
        });
        setDataAlertas(datafiltrada);
      
    }

    // gestiona las alertas generadas en el sistyema
    function setGestionar(id: number) {
        
        // colocar su url axiox aqui
        let datafiltrada = dataAlertas.map((item) => {
            if (item.EventId == id)
                return { ...item, EsGestionado: 1 };
            return item;
        });
        setDataAlertas(datafiltrada);
    
    }
   
    
    return (

        <>
            {
       
            dataAlertas.map((item) => {


                    const mediaurls = "";

                    const idUnique = item.EventId;
                    const navID = `nav_${idUnique}`;
                    const bntId = `btn_${idUnique}`;
                    let duration = moment.duration(Moment().diff(item.EventDateTime))
                    return (

                        <Card className="border" key={uuid()}>
                            <Card.Body  >
                                <div className="row g-0 g-xl-5 g-xxl-8  bg-light-dark text-dark">
                                    <div className="col-xl-4">
                                        <span> EventId: {idUnique}</span>
                                    </div>
                                    <div className="col-xl-3">
                                        <span> Placa: {item.description }</span>
                                    </div>
                                    <div className="col-xl-4">
                                        <span> Evento: {item.descriptionevent}</span>
                                    </div>
                                </div>
                                <div className="row g-0 g-xl-5 g-xxl-8 ">
                                    <div className="col-xl-4">
                                        <span> Operador:  {item.name}</span>
                                    </div>
                                    <div className="col-xl-3">
                                        <span> Fecha: {Moment(item.EventDateTime).format('DD/MM/YYYY HH:mm:ss')}</span>
                                    </div>
                                    <div className="col-xl-2">
                                        <span> Duracion:  N/A</span>
                                    </div>
                                    <div className="col-xl-2">
                                        <span> Velocidad: N/A</span>
                                    </div>
                                    <div className="col-xl-1">
                                        <span> Edad: {Moment(duration.asMilliseconds()).format("HH:mm")}</span>
                                    </div>
                                </div>
                                
                                <div className="row g-0 g-xl-5 g-xxl-8">
                                   
                                { (isDetails) && 
                                    (<div className="col-xl-3">
                                        <Button id={bntId} className="btn-sm" variant="primary" value={bntId} onClick={(e) => {
                                            setDetails(idUnique);
                                        }} >{
                                                (!item["esVisibleTabs"]) && ("Ver Detalles")

                                            }{
                                                (item["esVisibleTabs"]) && ("Cerrar Detalles")
                                            }</Button>
                                    </div> ) }
                                    { (!isActive) && 
                                    ( <div className="col-xl-3">
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
                                    </div>)}
                                   
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
                                                    
                                            {    (mediaurls != null) &&
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
export {CardContainerEventos}


