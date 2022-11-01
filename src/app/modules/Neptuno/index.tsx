import { RootState } from '../../../setup';
import { useSelector } from 'react-redux';
import { UserModelSyscaf } from '../auth/models/UserModel';
import { NeptunoTree } from './components/NeptunoTree';
import { NeptunoTable } from './components/NeptunoTable';


export default function Neptuno() {
    // informacion del usuario almacenado en el sistema
    const isAuthorized = useSelector<RootState>(
        ({ auth }) => auth.user
    );

    // convertimos el modelo que viene como unknow a modelo de usuario sysaf para los datos
    const model = (isAuthorized as UserModelSyscaf);

    if (model.containerneptuno) {

        return (
            <>
                {(model.containerneptuno === "serviciotecnico") ? (<>
                    <NeptunoTree contenedor={model.containerneptuno} />
                </>

                ) : (
                    <> 
                        <NeptunoTable contenedor={model.containerneptuno} />
                    </>
                )}
            </>
        );
    } else
        return <>USTED NO TIENE CONFIGURADO CONTENEDOR PARA MOSTRAR INFORMACION, FAVOR CONSULTE CON SU ADMINISTRADOR</>;
}


