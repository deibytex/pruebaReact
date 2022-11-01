
import { ReactElement, JSXElementConstructor } from "react";
import { Auth_EditarUsuario } from "../../../../apiurlstore";
import IndiceEntidad from "../../../../_start/helpers/components/IndiceGeneral";
import { PageTitle } from "../../../../_start/layout/core";
import { UserDTO } from "../models/UserModel";
import { USERLIST_URL } from "../redux/AuthCRUD";



export default function IndiceUsuarios() {
    return (
        <>
          <PageTitle > Listado Usuarios</PageTitle>
           <IndiceEntidad<UserDTO>
                url={USERLIST_URL} urlCrear="registration" titulo="Usuarios"
                nombreEntidad="Usuario"  customRequest={null}   custonAddButton={null}         >
                {(usuarios, botones) => <>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nombre</th>
                             <th>Email</th>
                             <th>Perfil</th>
                             <th>ClienteId</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios?.map(usuario =>
                            <tr key={usuario.id}>
                                <td>
                                    {botones(`${Auth_EditarUsuario}/${usuario.id}`, usuario.id)}
                                </td>
                                <td>
                                    {usuario.nombres}
                                </td>
                                <td>
                                    {usuario.email}
                                </td>
                                <td>
                                    {usuario.perfilId}
                                </td>
                                <td>
                                    {usuario.clienteId}
                                </td>
                            </tr>)}
                    </tbody>
                </>}

            </IndiceEntidad>
        </>

    )
}