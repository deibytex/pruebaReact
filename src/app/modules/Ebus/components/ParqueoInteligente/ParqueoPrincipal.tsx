import BlockUi from "@availity/block-ui";
import { useState } from "react";
import { toAbsoluteUrl } from "../../../../../_start/helpers/AssetHelpers";
import { DataClientes,  ParqueoProvider, useDataParqueo } from "../../core/ParqueoProvider";
import { listTabs } from "../../models/ParqueoModels";
import { Parqueo } from "./Parqueo";
import { ParqueoMapa } from "./ParqueoMapa";
import { UbicacionFlota } from "./UbicacionFlota";
import "../../../../../../node_modules/@availity/block-ui/src/BlockUi.css"
import "../../../../../../node_modules/@availity/block-ui/src/Loader.css"


type Props = {
};

 const  ParqueoPrincipal: React.FC<Props> = () => {
const {setVisible, ClienteSeleccionado, Clientes, setClienteSeleccionado, setClientes, dataTable, setdataTable, Visible} = useDataParqueo();

    const [activeTab, setActiveTab] = useState("#tab1");
    const setTab = (tabNumber: number) => {
        setActiveTab(`#tab${tabNumber}`);
        const element = document.querySelector(
          `#tab${tabNumber}_chart`
        ) as HTMLElement;
        if (!element) {
          return;
        }
      };
    //funcion que oculta el loader o indicador.
    const VisibleIndicador  = () => setVisible(false);
    return (<> 
        <ParqueoProvider>
            <BlockUi tag="span" className="bg-primary"  keepInView blocking={(Visible == undefined? true:Visible)}>
                <div className="me-sm-10 me-0">
                        <ul className="nav nav-tabs nav-pills nav-pills-custom">
                        {listTabs.map((tab, idx) => {
                            idx++;
                            return (<li className="nav-item mb-3" key={`tabenc_${idx}`}>
                            <a
                                onClick={() => setTab(idx)}
                                className={`nav-link w-225px h-70px ${activeTab === `#tab${idx}` ? "active btn-active-light" : ""
                                } fw-bolder me-2`}
                                id={`tab${idx}`}
                            >
                             {/*    <div className="nav-icon me-3">
                                <img
                                    alt=""
                                    src={toAbsoluteUrl(tab.icon)}
                                    className="default"
                                />

                                <img
                                    alt=""
                                    src={toAbsoluteUrl(tab.iconColored)}
                                    className="active"
                                />
                                </div>*/} 
                                <div className="ps-1">
                                <span className="nav-text text-gray-600 fw-bolder fs-6">
                                    {tab.titulo}
                                </span>
                                <span className="text-muted fw-bold d-block pt-1">
                                    {tab.subtitulo}
                                </span>
                                </div>
                            </a>
                            </li>
                            )
                        })}
                    </ul>
                </div>
                {/* end::Nav */}
            
                    <div className="tab-content flex-grow-1">
                            <div className={`tab-pane fade ${activeTab === "#tab1" ? "show active" : ""}`} id="tab1_content" style={{width:'100%'}}>
                                <div  className="row" style={{paddingTop:'10px'}}>
                                        {(dataTable.length != 0) && (<Parqueo Visible={VisibleIndicador} ClienteIds={ClienteSeleccionado?.clienteIdS.toString()} Data={dataTable}></Parqueo>)}
                                </div>
                            </div>
                            <div className={`tab-pane fade ${activeTab === "#tab2" ? "show active" : ""}`} id="tab2_content">
                            {(dataTable.length != 0) && (  <ParqueoMapa Datos={dataTable}/>)}
                            
                            </div>
                            <div className={`tab-pane fade ${activeTab === "#tab3" ? "show active" : ""}`} id="tab3_content">
                            {(dataTable.length != 0) && ( <UbicacionFlota Data={dataTable} ></UbicacionFlota>)}
                            </div>
                    </div>
                </BlockUi>
         </ParqueoProvider>
  </>)
 }
 export {ParqueoPrincipal}