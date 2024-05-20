
export class Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio) {
      this.id = id;
      this.titulo = titulo;
      this.transaccion = transaccion;
      this.descripcion = descripcion;
      this.precio = precio;
    }
  
    verify() {
      if(this.isValidString(this.titulo, this.descripcion) && this.isValidNumber(this.precio))
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