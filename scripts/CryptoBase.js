
export class CryptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual) {
      this.id = id;
      this.nombre = nombre;
      this.simbolo = simbolo;
      this.fechaCreacion = fechaCreacion;
      this.precioActual = precioActual;
    }
  
    verify() {
      if(this.isValidString(this.nombre, this.simbolo) && this.isValidNumber(this.precioActual))
        {
          return true;
        }
      else{
        return false;
      }
    };
  
    isValidString(...args){
      return args.every(arg => typeof arg === 'string' && arg.trim().length > 0);
    };

    isValidNumber(...args){
      const numeros = args.map(arg=>parseInt(arg)); 
      return numeros.every(numero => typeof numero === 'number' && !isNaN(numero) && numero > 0);
    };
  }