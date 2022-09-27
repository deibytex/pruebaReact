type Props = {
    titulo: string;
    subtitulo?: string;
};
// crea una cabecera con el titulo que se necesite
const Titulosubtitulo: React.FC<Props> = ({ titulo, subtitulo = "" }) => {
    return (
        <div>
            <div
              
                className="d-flex justify-content-around fs-4 text-gray-800 fw-bolder mt-1"
            >
                { titulo}
            </div>

            {(subtitulo != "") &&
                (<div className="fs-7 text-muted fw-bold">Informacion Relevante</div>)
            }
        </div>
    );

}




export {Titulosubtitulo}