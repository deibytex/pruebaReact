import { useEffect, useRef } from "react";
import { useDataDashboard } from "../../core/DashboardProvider"
import { OtrasUnidadesChart } from "./OtrasUnidadesChart";
import { SemanasChart } from "./SemanasChart";
import { UnidadesActivasChart } from "./UnidadesActivasChart";
import { VerticalChart } from "./VerticalChart";

const UnidadesActivas : React.FC = () =>{
    const interval = useRef<any>();
    const {  Data, setDataFiltrada, Filtrado, setFiltrado,  } = useDataDashboard();
   
    let AdminsUnidadesActivas:{usuarioIds:string, nombre:string} []= [];
    AdminsUnidadesActivas.push({"usuarioIds":"0","nombre":"Todos"})
    if(Data)
    if (Data['Unidades'] != undefined){
         Data['Unidades'].filter(function (item:any,index:any) {
             var i = AdminsUnidadesActivas.findIndex(x => (x.usuarioIds == item.usuarioIds && x.nombre == item.Administrador));
             if (i <= -1) {
                 AdminsUnidadesActivas.push({"nombre":item.Administrador,"usuarioIds":item.usuarioIds });
             }
             return null;
         });
     }
    useEffect(() => {
        return () =>{
            return 
        }
    }, []);
   
    const FiltrarByAdmins = (event:any) =>{
        let Usuario:string = event.target.attributes['data-bs-target'].value.split("--")[1];
        switch(Usuario) {
            case '0':
                setFiltrado(false);
                break;
            default:
                setFiltrado( true);
                if(Data != undefined){
                    let DataResult = Data['Unidades'].filter((val:any) =>{
                        return (val.usuarioIds == Usuario)
                    });
                    setDataFiltrada(DataResult);
                }
                 break;
          }
        }
        

      


    //para el menu de admins
    const MenuAdministradores = AdminsUnidadesActivas?.map((val:any,index:any) =>{
        return (
            <li key={val.nombre} className="nav-item" role="presentation">
                <button onClick={FiltrarByAdmins} key={val.nombre}  className= {`nav-link text-success ${(index == 0 ? 'active': '')} fw-bolder`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target={`#pill--${val.usuarioIds}`} type="button" role="tab" aria-controls="pills-profile" aria-selected="false">{val.nombre}</button>
            </li>
        )
    });
    //Para los divs de los admins
    let DivAdminitradores = AdminsUnidadesActivas?.map((val:any,index:any) =>{
       //interval.current = setInterval(() => {
            return (
                <div key={val.nombre} className= {`tab-pane fade show  ${(index == 0 ? "active":"")} border`} id={`pill--${val.usuarioIds}`} role="tabpanel" aria-labelledby="pills-home-tab">
                    div de {val.nombre}
                </div>    
            )
       // }, 10);
    });

    return (
        <>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
               {
                  (MenuAdministradores != undefined) && ( [...MenuAdministradores])
                }
            </ul>
            <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active border" id={`rep_assets_lst_admon_detalle`} role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                               <SemanasChart className={"shadow-lg"}></SemanasChart>
                            </div>
                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6">
                                <VerticalChart className={"shadow-lg"}></VerticalChart>
                            </div>
                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-10">
                                <UnidadesActivasChart className={"shadow-lg"}></UnidadesActivasChart>
                            </div>
                            <div className="col-sm-6 col-xl-6 col-md-6 col-lg-6 pt-10">
                               <OtrasUnidadesChart className={"shadow-lg"}></OtrasUnidadesChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export {UnidadesActivas}