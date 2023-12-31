import { NumberSchema } from "yup";
import { AuthModel } from "./AuthModel";
import { UserAddressModel } from "./UserAddressModel";
import { UserCommunicationModel } from "./UserCommunicationModel";
import { UserEmailSettingsModel } from "./UserEmailSettingsModel";
import { UserSocialNetworksModel } from "./UserSocialNetworksModel";

export interface UserModel {
  id: number;
  username: string;
  password: string | undefined;
  email: string;
  firstname: string;
  lastname: string;
  fullname?: string;
  occupation?: string;
  companyName?: string;
  phone?: string;
  roles?: Array<number>;
  pic?: string;
  language?: "en" | "de" | "es" | "fr" | "ja" | "zh" | "ru";
  timeZone?: string;
  website?: "https://keenthemes.com";
  emailSettings?: UserEmailSettingsModel;
  auth?: AuthModel;
  communication?: UserCommunicationModel;
  address?: UserAddressModel;
  socialNetworks?: UserSocialNetworksModel;
}

export interface UserModelSyscaf {
  Id: string;
  username: string;
  password: string | undefined;
  email: string;
  Nombres: string;
  clienteid: string | undefined | null;
  exp: Date;
  usuarioIds : number;
  containerneptuno : string;
  fatigue : boolean | undefined | null ;
  auth?: AuthModel;
  tipoClienteid?: TipoUsuario;
  menu : string,
  preoperacional: string,
  perfil: string | null | undefined
}
export interface UserDTO{
  id: string;
  userName: string;
  email: string;
  nombres: string;
  clienteId: string | undefined | null;
  perfilId: number;
  perfilTexto : string;
  ClienteNombre : string;
  usuarioIdS : number | null;
  
}

export interface TipoUsuario {
  id: number;
  descripcion: string;
}

export interface Opciones{
  NombreOpcion : string;
  Accion: string;
  Controlador: string;
  Logo: string;
  EsVisible : true;
  operaciones : any[];
  ParametrosAdicionales : string;
  OpcionPadreId: number;
  OpcionId : number;
  Orden : number;
  }