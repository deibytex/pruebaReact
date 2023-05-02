import moment from "moment";
import "moment/locale/es"
import "moment-timezone"
export const formatSimple = "YYYY/MM/DD";
export const  formatable = "YYYY/MM/DD HH:mm";
export const  formatableJson = "YYYY-MM-DDTHH:mm";
export const  formatSimpleJson = "YYYY-MM-DD";
export const  formatSimpleJsonColombia = "DD-MM-YYYY";
export const  formatFechasView = "DD/MM/YYYY";
export const  formatViewHoraMinuto = "DD/MM/YYYY HH:mm";

var utcMoment = moment.tz('America/Bogota').locale('es');
export const FechaServidor =new Date( utcMoment.format() );
export const FechaMomentUtc =utcMoment;

// milisegundos a time
export  function msToTime(s : number) {

    // Pad to 2 or 3 digits, default is 2
    function pad(n : number, z : number = 2) {
      z = z || 2;
      return ('00' + n).slice(-z);
    }
  
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
  }

  export function locateFormatNumberNDijitos(number: number, digits: number)
  {
    return number.toLocaleString?.('es-En', {
      minimumFractionDigits:digits,
      maximumFractionDigits: digits
    } )
  } 
  export function locateFormatPercentNDijitos(number: number, digits: number)
  {
    return number.toLocaleString?.('es-En', {
      style: "percent",
      minimumFractionDigits:digits,
      maximumFractionDigits: digits
    } )
  } 

  export function formatNumberChart(number :number)
  {
      if (!isNaN(number))
          return (number >= 1000000) ? `${(number / 1000000).toFixed(2)}M` : `${(number / 1000).toFixed(2)}K`
  
      return `${number.toFixed(2)}`
  }