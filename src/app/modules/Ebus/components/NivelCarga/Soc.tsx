
import { Modal } from "react-bootstrap-v5";
import React from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
type Props = {
    show:boolean;
    handleClose: () => void;
}
const  Soc:React.FC<Props>= ({show,handleClose}) =>{
const Actualizacion = (e:any) =>{
    console.log(`Minimo: ${e[0]}`);
    console.log(`Maximo:${e[1]} `);
}

 function Slider () {
    return(
        <Nouislider range={{
            min: [0],
            max: [100]
          }} start={[0,100]} onUpdate={Actualizacion}/>
    )
 }
return ( 
    <Modal 
    show={show} 
    onHide={handleClose} 
     size="sm">
      <Modal.Header closeButton style={{height:'20px'}}>
      <Modal.Title>{"Soc"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <div className="row">
              <div className="col-sm-12 col-xl-12 col-md-12 col-lg-12">
                {/* <div className="dropright" id="ventanaSoc" style={{transform: 'translate3d(110px, -85px, 0px) !important'}} data-keyboard="false" data-backdrop="static"> */}
                     <div style={{height:'80px',textAlign: 'center'}}> 
                        <div style={{margin: '7px', border:'1px solid #aaa'}}>
                            <span className="control-label font-weight-bold" style={{textAlign:'center', fontSize:'10px'}}>Soc:</span>
                            <Slider/>
                            <div id="result" style={{ background: 'red' }} />
                        </div>
                     </div> 
                {/* </div> */}
              </div>
          </div>
      </Modal.Body>
    </Modal>
);
}
export {Soc}