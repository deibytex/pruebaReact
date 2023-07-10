import { useEffect, useState } from "react";
import { useDataDashboard } from "../../core/DashboardProvider"
import { UnidadesActivasOBC } from "./UnidadesActivasOBC";
import { UnidadesActivasMIX } from "./UnidadesActivasMIX";
import { Churn } from "./churn";

const UnidadesActivas: React.FC = () => {
    const [MontarOBC, SetMontarOBC] = useState<boolean>(true);
    const [Montarchurn, SetMontarchurn] = useState<boolean>(true);
    const [MontarMX, SetMontarMX] = useState<boolean>(false);
    const [tab, setTab] = useState<string>("#tab1");
    const defaultPriopios: any[] = [
        {
            name: 'Propios',
            data: [],
            isSelected: true,
            getData: (MVSyscaf: any, f: any) => {
                return {
                    "x": MVSyscaf
                }
            }
        },
        {
            name: 'Arrendados',
            data: [],
            isSelected: true,
            getData: (MVSyscaf: any, f: any) => {
                return {
                    "x": MVSyscaf
                }
            }
        }
    ]
    const { Data, DataFiltrada, setDataFiltrada, Filtrado, setFiltrado, Cargando, setCargando, setshowChurn, showChurn } = useDataDashboard();
    let preSeleccionados = defaultPriopios.filter(x => x.isSelected).map(x => x.name);
    const [eventsSelected, setEventsSelected] = useState(defaultPriopios);
    const [value, setValue] = useState<any[]>(preSeleccionados);

    let AdminsUnidadesActivas: { usuarioIds: string, nombre: string }[] = [];
    AdminsUnidadesActivas.push({ "usuarioIds": "0", "nombre": "Todos" })

    if (Data)
        if (Data['Unidades'] != undefined) {
            Data['Unidades'].filter(function (item: any, index: any) {
                var i = AdminsUnidadesActivas.findIndex(x => ((x.usuarioIds != null || x.usuarioIds != undefined ? x.usuarioIds.trim() : x.usuarioIds) == (item.usuarioIds != null || item.usuarioIds != undefined ? item.usuarioIds.trim() : item.usuarioIds)));
                if (i <= -1) {
                    AdminsUnidadesActivas.push({ "nombre": item.Administrador, "usuarioIds": (item.usuarioIds != null || item.usuarioIds != undefined ? item.usuarioIds.trim() : item.usuarioIds) });
                }
                return null;
            });
        }

    const FiltrarByAdmins = (event: any) => {
        let Usuario: string = event.target.attributes['data-bs-target'].value.split("--")[1];
        switch (Usuario) {
            case '0':
                setFiltrado(false);
                break;
            default:
                setFiltrado(true);
                if (Data != undefined) {
                    let DataResult = Data['Unidades'].filter((val: any) => {
                        return (val.usuarioIds == Usuario)
                    });
                    setDataFiltrada(DataResult);
                }
                break;
        }
    }
    //para el menu de admins
    const MenuAdministradores = AdminsUnidadesActivas?.map((val: any, index: any) => {
        return (
            (val.nombre != "No Definido") && (<li key={val.nombre} className="nav-item" role="presentation">
                <button onClick={FiltrarByAdmins} key={val.usuarioIds} className={`nav-link text-success ${(index == 0 ? 'active' : '')} fw-bolder`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target={`#pill--${val.usuarioIds}`} type="button" role="tab" aria-controls="pills-profile" aria-selected="false">{val.nombre}</button>
            </li>)
        )
    });
    const handleChange = (value: any[]) => {
        let aux = defaultPriopios.map((x: any) => {
            x.isSelected = value.includes(x.name);
            return x;
        });
        setValue(value);
        setEventsSelected(aux);
    };

    useEffect(() => {
        FiltrarDatos();
    }, [eventsSelected])
    const FiltrarDatos = () => {
        if (value.length == 2) {
            setFiltrado(false);
            setCargando(false);
        } else
            value.map((item) => {
                let Seleccionado = "";
                switch (Filtrado) {
                    case true:
                        if (DataFiltrada != undefined) {
                            Seleccionado = (item == "OBCSyscaf" ? "No" : "Si");
                            let _dataFiltrada = DataFiltrada.filter(function (val: any, index: any) {
                                return (val.OBCSyscaf == Seleccionado || val.OBCSyscaf == null);
                            });
                            setFiltrado(true);
                            setDataFiltrada(_dataFiltrada);
                            setCargando(false);
                        }
                        break;
                    case false:
                        if (Data != undefined && Data['Unidades'] != undefined) {
                            Seleccionado = (item == "OBCSyscaf" ? "No" : "Si");
                            let DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
                                return (val.OBCSyscaf == Seleccionado || val.OBCSyscaf == null);
                            });
                            setFiltrado(true);
                            setDataFiltrada(DataFiltrada);
                            setCargando(false);
                        }
                        break;
                    default:
                        if (Data != undefined && Data['Unidades'] != undefined) {
                            Seleccionado = (item == "OBCSyscaf" ? "No" : "Si");
                            let DataFiltrada = Data['Unidades'].filter(function (val: any, index: any) {
                                return (val.OBCSyscaf == Seleccionado);
                            });
                            setFiltrado(true);
                            setDataFiltrada(DataFiltrada);
                            setCargando(false);
                        }
                        break;
                }
            });
    };

const FiltrarPestañas = (row:any) =>{
    let Tab = row.target.attributes.id.value;
    if(Tab == "pills-propios-tab"){
        setTab("#tab1");
        SetMontarOBC(true);
       SetMontarMX(false);
       SetMontarchurn(false);
    } else if(Tab == "pills-churn-tab"){
        setTab("#tab2");
        setshowChurn(true);
        SetMontarchurn(true);
        SetMontarMX(false);
        SetMontarOBC(false);
    }
    else
    {
        setTab("#tab3");
        SetMontarOBC(false);
        SetMontarMX(true);
   
    }
};
    return (
        <>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                {
                    (MenuAdministradores != undefined) && ([...MenuAdministradores])
                }
            </ul>
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active border" id={`rep_assets_lst_admon_detalle`} role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className="container">
                        <ul className="nav nav-tabs" id="pills-tab"  role="tablist">
                            <li className="nav-item" role="presentation" onClick={FiltrarPestañas}>
                                <button className={`nav-link text-success active fw-bolder`} id="pills-propios-tab" data-bs-toggle="pill" data-bs-target={`#pill-propios`} type="button" role="tab" aria-controls="pills-propios" aria-selected="false">OBC</button>
                            </li>
                            <li className="nav-item" role="presentation" onClick={FiltrarPestañas}>
                                <button className={`nav-link text-success fw-bolder`} id="pills-churn-tab" data-bs-toggle="pill" data-bs-target={`#pill-churn`} type="button" role="tab" aria-controls="pills-propios" aria-selected="false">Churn</button>
                            </li>
                            <li className="nav-item" role="presentation"  onClick={FiltrarPestañas}>
                                <button className={`nav-link text-success fw-bolder`} id="pills-arrendado-tab" data-bs-toggle="pill" data-bs-target={`#pill-alquilado`} type="button" role="tab" aria-controls="pills-alquilado" aria-selected="false">Mix Visión</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="pill-propios" role="tabpanel" aria-labelledby="home-tab">
                                    {/* Para los OBC */}
                                    {(tab == "#tab1") && (MontarOBC) && (<UnidadesActivasOBC tab={tab}></UnidadesActivasOBC>)}  
                            </div>
                            <div className="tab-pane fade" id="pill-churn" role="tabpanel" aria-labelledby="home-tab">
                                    {/* Para los churn */}
                                  
                                    {(tab == "#tab2") && (Montarchurn) &&(showChurn) && (<Churn></Churn>)}  
                            </div>
                            <div className="tab-pane fade" id="pill-alquilado" role="tabpanel" aria-labelledby="profile-tab">
                                    {/* Para los MIX */}
                                    {(tab == "#tab3") && (MontarMX) && (<UnidadesActivasMIX tab={tab}></UnidadesActivasMIX>)}  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export { UnidadesActivas }