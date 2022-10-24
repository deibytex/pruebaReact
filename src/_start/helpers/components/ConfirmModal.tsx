import React, {createContext , useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap-v5';
import { ConfirmDialogModel } from '../Models/ConfirmDialgoModal';

// creamos una variable con los valores iniciales
const initialValues: ConfirmDialogModel =
  { titulo: "", backdrop: "true", keyboard: false, handleConfirm: () => {}, body: null }

// exportamos el contexto que pasaríamos cuando uticemos el confirm dialog
const ConfirmDialogContex = createContext({
  setDataConfirm: (data: ConfirmDialogModel) => { }
});

//const ConfirmDialog: React.FC<ConfirmDialogModel> = ( ) =>{
// creamos el provider que sera el componente que se le pasaria para poder ser usado entre componentes
export const ConfirmDialogProvider: React.FC = ({ children }) => {

  const [data, setDataConfirm] = useState<ConfirmDialogModel>(initialValues);
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  return (
    <ConfirmDialogContex.Provider value={{
      setDataConfirm
    }}>
      <Modal
        show={show}
        onHide={() => { handleClose(); setDataConfirm(initialValues); }}
        backdrop={data.backdrop}
        keyboard={data.keyboard}
        centered        >
        <Modal.Header closeButton>
          <Modal.Title>{data.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data.body}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { data.handleConfirm(); handleClose(); }}>
            Si
          </Button>
          <Button variant="secondary" onClick={handleClose} >No</Button>
        </Modal.Footer>
      </Modal>
      {children}
    </ConfirmDialogContex.Provider>
  );

};
export const useCommonConfirmDialog = () => useContext(ConfirmDialogContex);


