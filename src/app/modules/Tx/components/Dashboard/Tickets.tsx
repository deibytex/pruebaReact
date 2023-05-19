import { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import { useEffect } from "react";
import { useDataDashboard } from "../../core/DashboardProvider";
import { GetSnapShotTickets } from "../../data/Dashboard";

const Tickets:React.FC = () =>{
    const {Data, Clientes, ClienteSeleccionado, setData} = useDataDashboard();

    let MenuAdministradores = [];

    


    /* DESDE AQUI LO HICE PARA PROBAR LAS CONEXIONES CREADAS */


    /* FIN DE LAS CONEXIONES */
        let AdminsTransmision:{usuarioIds:string, nombre:string} []= [];
        AdminsTransmision.push({"usuarioIds":"0","nombre":"Todos"})
        if(Data)
        if (Data['Ticket'] != undefined){
             Data['Ticket'].filter(function (item:any,index:any) {
                 var i = AdminsTransmision.findIndex(x => (x.usuarioIds == item.usuarioIds && x.nombre == item.Administrador));
                 if (i <= -1) {
                    AdminsTransmision.push({"nombre":item.Administrador,"usuarioIds":item.usuarioIds });
                 }
                 return null;
             });
         }


         if(Data)
         if (Data['Tickets'] != undefined){
              Data['Tickets'].filter(function (item:any,index:any) {
                  var i = AdminsTransmision.findIndex(x => (x.usuarioIds == item.usuarioIds && x.nombre == item.Administrador));
                  if (i <= -1) {
                     AdminsTransmision.push({"nombre":item.Administrador,"usuarioIds":item.usuarioIds });
                  }
                  return null;
              });
          };

          MenuAdministradores = AdminsTransmision.map((val:any,index:any) =>{
            return (
                <li key={val.nombre} className="nav-item" role="presentation">
                    <button key={val.nombre}  className="nav-link text-success fw-bolder" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target={`#pills-${val.usuarioIds}`} type="button" role="tab" aria-controls="pills-profile" aria-selected="false">{val.nombre}</button>
                </li>
            )
        })
        useEffect(() => {
           
           
        }, []);
return(
    <>
        <div className="container">
            <div className="row">
                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12" id="ticketspestana">
                    <nav>
                        <ul id="rep_assets_lst_admon_tickets" className="nav nav-pills nav-pills-bordered nav-justified caja_tickets" role="tablist" />
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="rep_assets_lst_admon_detalle_ticket">
                            <div className="row">
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="text-center"><span id="CantidadTicket" className="fs-2"></span></div>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="text-center"><label className="label label-sm font-weight-bold">TICKET POR ADMINISTRADOR</label></div>
                                    <div id="c3-pie-ticket"></div>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="text-center"><label className="label label-sm font-weight-bold">TICKET POR BASE</label></div>
                                    <div id="c3-barcentro-ticket"></div>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-10">
                                    <div className="text-center"><label className="label label-sm font-weight-bold">TIPO TICKET</label></div>
                                    <div id="c3-bar-ticket"></div>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                    <div className="table-responsive">
                                        <table id="tablaAdminstickets w-100" className="table datatable-responsive4">
                                            <thead>
                                                <tr className="bg-teal-300">
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12 text-center" id="ticketspestananull">
                    <span className="font-weight-bold mb-3 text-muted fs-1" >No hay datos que mostrar !!!</span>
                </div>
            </div>
        </div>
    </>
)
}
export {Tickets}