import React from "react";
import { AsideDefault } from "./components/aside/AsideDefault";
import { Footer } from "./components/Footer";
import { ScrollTop } from "./components/ScrollTop";
import { Content } from "./components/Content";
import { MasterInit } from "./MasterInit";
import { PageDataProvider } from "./core";

import { Header } from "./components/header/Header";

const MasterLayout: React.FC = ({ children }) => {
  return (
    <PageDataProvider>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <AsideDefault />
          <div
            className="bg-light-dark wrapper d-flex flex-column flex-row-fluid "
            id="kt_wrapper"
          >
             <Header/>
            <div className="d-flex flex-column flex-column-fluid ">
                {/* <Toolbar />*/ } 
           
              <div
                className="content fs-6 d-flex flex-column-fluid px-2 "
                id="kt_content"
              >
                <Content>{children}</Content>
              </div>
            </div>
            <Footer />
          </div>
          {/* <Sidebar />*/ } 
          
        </div>
      </div>
      <ScrollTop />
      <MasterInit />
     {/*<ExploreMain />*/ } 
    </PageDataProvider>
  );
};

export { MasterLayout };
