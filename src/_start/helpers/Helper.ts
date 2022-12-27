import moment from "moment";


var utcMoment = moment.utc().add(-5 , 'hours');
export const FechaServidor =new Date( utcMoment.format() );