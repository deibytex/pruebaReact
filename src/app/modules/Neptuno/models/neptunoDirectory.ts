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
    Peso: number;
    Tipo: string;
    Orden: number |null;
    Src: string;
    MovimientoId: number;
    DatosAdicionales: any;
    archivo : any  |null;
}

export const defaultNuevoArchivoDTO: NuevoArchivoDTO = {
   
    NombreArchivo: "",
    Descripcion: "",
    Peso: 0,
    Tipo: "",
    Orden: null,
    Src: "",
    MovimientoId: 1,  
    DatosAdicionales: { },
    archivo: null
};
  

export interface ArchivoDTO
{
    ArchivoId : number;
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
    EsActivo: boolean;
}