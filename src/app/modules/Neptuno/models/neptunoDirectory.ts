export interface neptunoDirectory {
    archivoId: number;
    nombre: string;
    descripcion: string | undefined | null;
    tipo: string;
    src: string;
    peso: number;
    hijos: Array<neptunoDirectory> | null;

};

export interface NuevoArchivoDTO
{
    NombreArchivo: string ;
    Descripcion: string;
    DescripcionLog: string |null;
    Peso: number;
    Tipo: string;
    Orden: number |null;
    Src: string;
    MovimientoId: number;
    AreaId: number ;
    UsuarioId: string;
    DatosAdicionales: string;
    archivo : any;
}

export const defaultNuevoArchivoDTO: NuevoArchivoDTO = {
    AreaId: 4,
    NombreArchivo: "",
    Descripcion: "",
    DescripcionLog: null,
    Peso: 0,
    Tipo: "",
    Orden: null,
    Src: "",
    MovimientoId: 0,
    UsuarioId: "",
    DatosAdicionales: "",
    archivo: ""
};
  

export interface ArchivoDTO
{
    Archivoid : number;
    Nombre: string;
    Descripcion: string;
    Peso: number;
    Tipo: string;
    Orden: number |null;
    Src: string;
    DatosAdicionales: string;
    FechaSistema: Date ;
    UsuarioActualizacion: string|null;
    UltFechaActualizacion: Date|null;
    UsuarioCreacion: string|null;
}