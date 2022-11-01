import axios, { AxiosPromise, AxiosResponse } from "axios";
import { ReactElement, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import confirmarDialog from './ConfirmDialog'
import Paginacion from './Paginacion';
import ListadoGenerico from './ListadoGenerico'
import Button from "./Button";

export default function IndiceEntidad<T>(props: indiceEntidadProps<T>) {

    const [entidades, setEntidades] = useState<T[]>();
    const [totalDePaginas, setTotalDePaginas] = useState(0);
    const [recordsPorPagina, setRecordsPorPagina] = useState(10);
    const [pagina, setPagina] = useState(1);

    
        useEffect(() => {
            cargarDatos();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [pagina, recordsPorPagina])

    function cargarDatos() {
        // por defecto se manda una [peticion get
        // con los parametros en la url, se parametriza para que reciba un Axiospromise 
        // para ejecutar cualquier peticion post, debe retornar una lista del objeto para que funcione
        let genericRequest  =  (props.customRequest == null) ?  axios.get(props.url, {
            params: { pagina, recordsPorPagina }
        }) : props.customRequest;
       
        genericRequest.then((respuesta: AxiosResponse<T[]>) => {
                const totalDeRegistros =
                    parseInt(respuesta.headers['totalregistros'], 10);                  
                setTotalDePaginas(Math.ceil(totalDeRegistros / recordsPorPagina));
                setEntidades(respuesta.data);
            })
    }

    async function borrar(id: string) {
        try {
            await axios.delete(`${props.url}/${id}`)
            cargarDatos();
        }
        catch (error) {
            console.log(error);
        }
    }

    const botones = (urlEditar: string, id: string) => <>
        <Link className="btn btn-success" to={urlEditar}>Editar</Link>
        <Button
            onClick={() => confirmarDialog(() => borrar(id))}
            className="btn btn-danger">Borrar</Button>
    </>

    return (
        <>
            <h3>{props.titulo}</h3>
            {props.urlCrear ?  (props.custonAddButton  != null) ?  
            <button className="btn btn-primary" onClick={ () => { if(props.custonAddButton != null) props.custonAddButton(true); }} >  
            Crear</button> :<Link className="btn btn-primary" to={props.urlCrear}>
                Crear {props.nombreEntidad}
            </Link>  : null }

            <div className="form-group" style={{ width: '150px' }}>
                <label>Registros por página:</label>
                <select
                    className="form-control"
                    defaultValue={10}
                    onChange={e => {
                        setPagina(1);
                        setRecordsPorPagina(parseInt(e.currentTarget.value, 10))
                    }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <Paginacion cantidadTotalDePaginas={totalDePaginas}
                paginaActual={pagina} onChange={nuevaPagina => setPagina(nuevaPagina)} />

            <ListadoGenerico listado={entidades}>
                <table className="table table-striped">
                    {props.children(entidades!, botones)}
                </table>
            </ListadoGenerico>
        </>
    )
}

interface indiceEntidadProps<T> {
    url: string;
    urlCrear?: string;
    children(entidades: T[],
        botones: (urlEditar: string, id: string) => ReactElement): ReactElement;
    titulo: string;
    nombreEntidad?: string;
    // nueva propiedad que presonaliza el request para satisfacer los parametros complejos
    customRequest : AxiosPromise<any> | null;
    // nueva propiedad para personalizar los botones que se usaran en el aplicativo
    custonAddButton :  ((arg0: boolean) => void) | null;
}