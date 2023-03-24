import { useFormikContext } from "formik";
import { ChangeEvent, useState } from "react"

export default function FormGroupImagen(props: formGroupImagen){

    const divStyle = {marginTop: '10px'}
    const imgStyle = {width: '450px'}
    const {values} = useFormikContext<any>();
    const [imagenBase64, setImagenBase64] = useState('');
    const [imagenURL, setImagenURL] = useState(props.imagenURL)
 //   const {values} = useFormikContext<any>();

    const ManejarOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files){
            const archivo = e.currentTarget.files[0];
           /* const extension = e.currentTarget.files[0].name;
            aBase64(archivo)
                .then((representacionBase64: string) => setImagenBase64(representacionBase64))
                .catch(error => console.error(error))*/
                setImagenURL('');
           values[props.campo] = archivo;
        
        }
    }

   /* const aBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        })
    }*/

    return (
        <div className="row col-xs-12 col-md-12 col-lg-12 mt-2">
            <label className="col-md-4">{props.label}</label>
           
                <input type="file"  className="col-md-8" onChange={ManejarOnChange} />
           
            {imagenBase64 ? 
            <div>
                <div style={divStyle}>
                    <img style={imgStyle} src={imagenBase64} alt="archivo seleccionado" />
                </div>
            </div> : null    
        }
        {imagenURL ? 
            <div>
                <div style={divStyle}>
                    <img style={imgStyle} src={imagenURL} alt="imagen seleccionada" />
                </div>
            </div> : null    
        }
        </div>
    )
}

interface formGroupImagen{
    campo: string;
    label: string;
    imagenURL: string;
}

FormGroupImagen.defaultProps = {
    imagenURL: ''
}