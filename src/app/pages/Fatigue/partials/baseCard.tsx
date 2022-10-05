import { Button, Card, Nav, Tab, Tabs } from "react-bootstrap-v5";
import { string } from "yup";
import { datosFatigue } from "../dataFatigue";
import { v4 as uuid } from 'uuid';
import Moment from 'moment';
import { useState } from "react";
import moment from "moment";
type CardOptions =
  {
    titulo: string;

  }

  type propsCardContainer = {

     type: number;
     data : any[];
  };
export default function CardContainer() {

  let dataConAlertas = datosFatigue.getTimeLine();
  let arrayTotal: [] = [];
  dataConAlertas.filter((m) => {
    return (m.Estado == "Operando" && m["Alertas"].length > 0);
  }).map((m) => {
    Array.prototype.push.apply(arrayTotal, m["Alertas"]);

  });
  const [dataAlertas, setDataAlertas] = useState<any[]>(arrayTotal);

  // funcion para cambiar el estado
  // de ver detalles para que se renderice el tab de ver mas
  function setDetails(id: string) {
    let datafiltrada = dataAlertas.map((item) => {
      if (item["id"] == id)
        return { ...item, esVisibleTabs: !item["esVisibleTabs"] };
      return item;
    });
    setDataAlertas(datafiltrada);
  }

  // gestiona las alertas generadas en el sistyema
  function setGestionar(id: string) {
    // colocar su url axiox aqui
    let datafiltrada = dataAlertas.map((item) => {
      if (item["id"] == id)
        return { ...item, EsGestionado: 1 };
      return item;
    });
    setDataAlertas(datafiltrada);
  }
  return (

    <>
      {

        dataAlertas.map((item) => {

          const idUnique = item["id"];
          const navID = `nav_${idUnique}`;
          const bntId = `btn_${idUnique}`;
          let duration  =  moment.duration(Moment().diff(item["horaDatetime"]))
          return (

            <Card  className="border"  key={uuid()}>
             <Card.Body  >
                <div className="row g-0 g-xl-5 g-xxl-8 ">
                <div className="col-xl-12 bg-light-dark text-dark">
                <span>Alerta: {item["alerta"]} -- Vehiculo: {item["vehiculo"]}</span>
                  </div>
                  <div className="col-xl-4">
                    <span> Operador: Conductor Desconocido Syscaf</span>
                  </div>
                  <div className="col-xl-4">
                    <span> Fecha: {Moment(item["horaDatetime"]).format('DD/MM/YYYY HH:mm:ss')}</span>
                  </div>
                  <div className="col-xl-3">
                    <span> Edad: { Moment(duration.asMilliseconds()).format("HH:mm") }</span>
                  </div>
                </div>
                    {/*<div className="row g-0 g-xl-5 g-xxl-8">
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

            
                  (item["esVisibleTabs"]) && (
                    <Tabs
                      defaultActiveKey="videos"
                      className="mb-3 border"
                      justify
                    >
                      <Tab eventKey="videos"  title="Videos">
                        <span>afdsadsfadgafdgsfgsfgsdfgsdfg</span>
                      </Tab>
                      <Tab eventKey="localizacion" title="Localizacion">
                        <span>faddfasdfasdfasd</span>
                      </Tab>
                      <Tab eventKey="detalles" title="Detalles">
                        <span>ujum aja ujum</span>
                      </Tab>

                    </Tabs>)*/
                }



              </Card.Body>
            </Card>


          )

        })
      }
    </>
  );
}


