import moment from "moment";


var utcMoment = moment.utc().add(-5 , 'hours');
export const FechaServidor =new Date( utcMoment.format() );

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