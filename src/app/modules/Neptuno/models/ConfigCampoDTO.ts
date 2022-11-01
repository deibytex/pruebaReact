
// modelo de configuracion de los campos que tiene cada areas
export interface configCampoDTO {
    campo: string;
    label: string;
    tipo: string  | null;
    categoria:string  | null;  
    valores: string  | null;

};

// objeto que guarda la informacion en cada campo que necesita
export interface datosCampoDTO {
    campo: string;
    valor: string;
};

// objeto que guarda la informacion en cada campo que necesita
export interface AreaDTO {
    AreaId: number;
    Nombre: string;
    container: string;
    CamposCapturar: string;
};