import { DateRangePicker } from "rsuite";
import { useDataZpOperadorMovil } from "../../core/ZpOperadorMovilProvider";
import { Button } from "react-bootstrap-v5";
import ReactApexChart from "react-apexcharts";
import { useEffect, useRef } from "react";
import moment from "moment";
type Props = {
    FnConsultar : () =>void;
    ShowModal: () => void;
    opciones:any;
    acumulado:any,
    Titulo:string
}
const Graficas : React.FC<Props> = ({FnConsultar, ShowModal, opciones, acumulado, Titulo}) =>{
    const { fechaInicial, fechaFinal, setfechaInicial, setfechafinal } = useDataZpOperadorMovil();
    const refChart = useRef<ReactApexChart>(null);
    const refChart2 = useRef<ReactApexChart>(null);
    const { allowedMaxDays, allowedRange } = DateRangePicker;
    useEffect(() => {
        if (allowedRange)
            allowedRange(moment().add(-1, "months").toDate(), moment().toDate());
      return function cleanUp() {
        //SE DEBE DESTRUIR EL OBJETO CHART
      };
    },[allowedMaxDays])
    return (

        <><div id="solid-movildia">
        <div className='tab-pane' style={{zIndex:'10'}}>
                <div className="card-body border modal-title ">
                <label className="control-label label-sm fw-bolder ">Filtros</label>
                <div className="d-flex align-items-center mb-3 mb-lg-0">
                    <div className="mb-3">
                        <div className="input-group mb-5">
                            <span className="align-middle control-label label-sm fw-bolder ml-5 align-middle m-2">Rango Fechas:</span>
                            <DateRangePicker className="m-2" onChange={(e:any) =>{
                                if (e !== null) {
                                    setfechaInicial(e[0]);
                                    setfechafinal(e[1]);
                                  }
                            }} placeholder="Seleccione una fecha" />
                            <span className="input-group-text m-2" style={{height:'35px'}}><i className="bi-calendar-date "></i></span>
                            <Button className="m-2  btn btn-sm btn-primary" onClick={ShowModal}><i className= {`${(Titulo == "Vehiculos") ?"bi-car-front-fill": "bi-person-fill"}`}></i></Button>
                            <Button id="btnConsultar" className="m-2  btn btn-sm btn-primary" onClick={FnConsultar}><i className="bi-search mr-2"></i> Consultar</Button>
                        </div>
                    </div>
                    <div className="ml-3">
                        <label className="control-label label-sm  mr-2 text-white">Consultar</label>
                        <span className="input-group ">
                        </span>
                    </div>
                </div>
            </div>
            <div className="card-body d-lg-flex align-items-lg-center justify-content-lg-between flex-lg-wrap border mt-2 mb-2">
                <div className="row w-100" id="efi-chartzpMovilAgrupado">
                    {/* <div className="chart" id="zpMovilAgrupado"></div> */}
                    {(acumulado != null) && (
                                <ReactApexChart ref={refChart2}
                                options={acumulado.options}
                                series={acumulado.series} type="bar"
                                height={200} />)}
                </div>
            </div>
            <div className="card" id="efi-chartzpMovil" style={{border: '1px solid #5ab55e', borderRadius:'5px'}}>
                <div className="card-body">
                    <div className="chart-container">
                        <div className="row">
                            {/* <div className="chart" id="zpMovil"></div> */}
                            {(opciones != null) && (
                                <ReactApexChart ref={refChart}
                                options={opciones.options}
                                series={opciones.series} type="bar"
                                height={320} />)}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div></>
    )
}
export {Graficas}