import { Anuncio } from "./anuncio.js";

export class anuncio_Auto extends Anuncio{
    constructor(id, titulo, transaccion, descripcion, precio, puertas, kilometros, potencia) {
      super(id,titulo,transaccion,descripcion,precio);
        this.puertas = puertas;
        this.kilometros = kilometros;
        this.potencia = potencia;
    }
  
    verify() {
      if(this.isValidString(this.titulo, this.descripcion) && this.isValidNumber(this.precio,this.puertas,this.kilometros,this.potencia))
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
