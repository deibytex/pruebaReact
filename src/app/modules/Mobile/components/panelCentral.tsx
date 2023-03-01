import React, { useState } from "react";
import { listTabs } from "../data/tabList";
import { TablaProperacional } from "../components/TablaPreoperacional"
import { TablaSinProperacional } from "../components/TablaSinPreoperacional"
import { toAbsoluteUrl } from "../../../../_start/helpers";
import { ExportarReportes } from "./ExportarReportes";

type Props = {
    className: string;
    innerPadding?: string;
    clienteid: string
    fecha: string;
    filtro: string;
};

export const MOV_PanelCentral: React.FC<Props> = ({ className, innerPadding = "", clienteid, fecha, filtro }) => {

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

    return (
        <div className={`card ${className}`}>
            <div className="card-body pt-0">
                <div className=" flex-wrap flex-xxl-nowrap justify-content-center justify-content-md-start pt-4">
                    {/* begin::Nav */}
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
                                        <div className="nav-icon me-3">
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
                                        </div>
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
                    {/* begin::Tab Content */}
                    <div className="tab-content flex-grow-1">
                        {/* begin::Tab Pane 1 */}
                        <div className={`tab-pane fade ${activeTab === "#tab1" ? "show active" : ""}`} id="tab1_content" >
                            {/* begin::Cards */}
                            <div className="overflow-auto">
                                <TablaProperacional clienteid={clienteid} fecha={fecha} filtro={filtro} />
                            </div>
                            {/* end::Cards      */}
                        </div>
                        {/* end::Tab Pane 1 */}

                        {/* begin::Tab Pane 2 */}
                        <div className={`tab-pane fade ${activeTab === "#tab2" ? "show active" : ""}`} id="tab2_content">
                            {/* begin::Cards */}
                            <div className="overflow-auto">
                                <TablaSinProperacional />
                            </div>
                            {/* end::Cards      */}
                        </div>


                        {/* end::Tab Pane 2 */}
                        {/* begin::Tab Pane 3 */}
                        <div className={`tab-pane fade ${activeTab === "#tab3" ? "show active" : ""}`} id="tab3_content">
                            {/* begin::Cards */}
                            <div className="overflow-auto">                                
                                    <ExportarReportes />
                            </div>
                            {/* end::Cards      */}
                        </div>

                        {/* end::Tab Pane 3 */}

                    </div>
                    {/* end::Tab Content */}
                </div>
            </div>
        </div>
    )
}