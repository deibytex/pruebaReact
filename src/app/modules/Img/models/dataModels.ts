export interface clientes{
    clienteIdS:number;
    clienteNombre:string;
}

export interface dualList{
    value:string;
    label:string;
}

export interface ErroresViajesyUso{
    Consecutivo: number;
    Cliente: string;
    US: string;
    VehicleID: number;
    Placa: string;
    VehicleSiteID: number;
    VehicleSiteName: number;
    TripNo: string;
    DriverID: number;
    DriverName: string;
    DriverSiteID: number;
    DriverSiteName: string;
    OriginalDriverID: number;
    OriginalDriverName: string;
    TripStart: string;
    TripEnd: string;
    CategoryID: number;
    Notes: string;
    StartSubTripSeq: number;
    EndSubTripSeq: number;
    TripDistance: string;
    Odometer: string;
    MaxSpeed: number;
    SpeedTime: number;
    SpeedOccurs: number;
    MaxBrake: number;
    BrakeTime: number;
    BrakeOccurs: number;
    MaxAccel: number;
    AccelTime: number;
    AccelOccurs: number;
    MaxRPM: number;
    RPMTime: number;
    RPMOccurs: number;
    GBTime: number;
    ExIdleTime: number;
    ExIdleOccurs: number;
    NIdleTime: number;
    NIdleOccurs: number;
    StandingTime: number;
    Litres: string;
    StartGPSID: string;
    EndGPSID: string;
    StartEngineSeconds: number;
    EndEngineSeconds: number;
}