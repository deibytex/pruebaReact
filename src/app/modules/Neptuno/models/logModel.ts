export interface LogDTO
{
    ArchivoId : number;
    NombreArchivo: string;
    Descripcion: string;
    NombreMovimiento: string;
    EstadoArchivo: boolean|string;
    container: string;
    CamposCapturar: string;
    UsuarioId: string;
    FechaSistema: Date ;
}

export interface UsuariosDTO
{
    UsuarioId: string,
    Nombres : string
}
export const initialdataUsuarios : UsuariosDTO =
{
    UsuarioId : "",
    Nombres : ""
}