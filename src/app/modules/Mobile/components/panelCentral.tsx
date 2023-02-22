import React, { useState } from "react";
import { listTabs } from "../data/tabList";
import { TablaProperacional } from "../components/TablaPreoperacional"
import { TablaSinProperacional } from "../components/TablaSinPreoperacional"
import { toAbsoluteUrl } from "../../../../_start/helpers";

type Props = {
    className: string;
    innerPadding?: string;
};

export const MOV_PanelCentral: React.FC<Props> = ({ className, innerPadding = "" }) => {
    const [width, setWidth] = useState("0px")
    const [activeTab, setActiveTab] = useState("#tab1");

    const setTab = (tabNumber: number) => {
        setActiveTab(`#tab${tabNumber}`);

        const element = document.querySelector(
            `#tab${tabNumber}_chart`
        ) as HTMLElement;
        if (!element) {
            return;
        }

        const height = parseInt(getCss(element, "height"));

        if (tabNumber === 2)
            setWidth("100px");
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
                    {/* begin::Tab Pane 1 */}
                    <div style={{ height: width }}>
                        <div
                            className={`tab-pane fade ${activeTab === "#tab1" ? "show active" : ""
                                }`}
                            id="tab1_content"
                        >

                            <div className="d-flex justify-content-center mb-10">

                                <div className="row g-0 g-xl-12 g-xxl-12">
                                    {/* begin::Cards */}


                                    <div className="overflow-auto">

                                        <TablaProperacional />

                                    </div>

                                </div>
                                {/* end::Cards      */}
                            </div>
                        </div>
                        {/* end::Tab Pane 1 */}
                    </div>


                    {/* begin::Tab Pane 2 */}
                    <div
                        className={`tab-pane fade ${activeTab === "#tab2" ? "show active" : ""
                            }`}
                        id="tab2_content"
                    >


                        {/* begin::Cards */}
                        <div className="overflow-auto">

                            <TablaSinProperacional />

                        </div>
                        <div style={{ height: width }}>

                        </div>
                        {/* end::Cards      */}
                    </div>
                    {/* end::Tab Pane 2 */}
                </div>
                {/* end: Card Body */}
            </div>
        </div>
    )
}


function getCss(el: HTMLElement, styleProp: string) {
    const defaultView = (el.ownerDocument || document).defaultView;
    if (!defaultView) {
        return "";
    }

    // sanitize property name to css notation
    // (hyphen separated words eg. font-Size)
    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
}