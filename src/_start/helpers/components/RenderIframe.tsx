import { PageTitle } from "../../layout/core";
import { useRef, useState } from "react";


type Props = {
  titulo: string; url: string;
};


 export const RenderIframe: React.FC<Props> = ({titulo, url}) => {
   
  const [height, setHeight] = useState("0px");
  const onLoad = () => {
    setHeight("100%");
  };
  return (
    <>
      <PageTitle>{titulo}</PageTitle>
      <div className="container d-flex flex-row align-items-center justify-content-center text-center m-10"
       style={{height: "800px"}}
      >
        <iframe           
          onLoad={onLoad}
           src={atob(url)} width="100%"
          height={height}
           allowFullScreen
          ></iframe>
      </div>
    </>

  )
}