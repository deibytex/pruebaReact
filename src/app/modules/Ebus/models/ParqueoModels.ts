export interface ClienteDTO{
    clienteIdS:number;
    ClienteId:string|null;
    clienteNombre:string|null;
}

export const InicioCliente : ClienteDTO ={
    clienteIdS:0,
    ClienteId:"",
    clienteNombre:"",
}

export interface TablaDTO{
    altitud:number;
    assetId:string;
    latitud:string;
    localizacion:string;
    longitud:string
    placa:string;
    avlString:string;
    avl:string;
}


type TabProperty = {
    icon : string;
    iconColored : string;
    titulo : string;
    subtitulo : string;
    
   }
   
   const tab1 : TabProperty = {  icon: "/media/svg/logo/gray/kanba.svg", iconColored : "/media/svg/logo/colored/kanba.svg", titulo: "Parqueo inteligente", subtitulo : "Inicio"}
   const tab2 : TabProperty = {  icon: "/media/svg/logo/gray/tower.svg", iconColored : "/media/svg/logo/colored/tower.svg", titulo: "Localización buses", subtitulo : "Mapa"}
   const tab3 : TabProperty = {  icon: "/media/svg/logo/gray/tvit.svg", iconColored : "/media/svg/logo/colored/tvit.svg", titulo: "Ubicación flota", subtitulo : "Detallado"}
export const listTabs : TabProperty[] = [tab1,tab2,tab3]


export interface TablaUbicacionDTO{
    placa: string,
    localizacion:string,
}
export const InicioUbicacionTabla : TablaUbicacionDTO = {
    placa:"",
    localizacion:"",
}


