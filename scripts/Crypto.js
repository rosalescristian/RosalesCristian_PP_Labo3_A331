import { CryptoBase } from "./CryptoBase.js";

export class Crypto extends CryptoBase{
    constructor(id, nombre, simbolo, fechaCreacion, precioActual, consenso, cantidad, algoritmo, web) {
      super(id, nombre, simbolo, fechaCreacion, precioActual);
        this.consenso = consenso;
        this.cantidad = cantidad;
        this.algoritmo = algoritmo;
        this.web = web;
    }
  
    verify() {
      if( this.isValidString(this.nombre, this.simbolo, this.consenso, this.algoritmo) && 
          this.isValidNumber(this.precioActual,this.cantidad))
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
