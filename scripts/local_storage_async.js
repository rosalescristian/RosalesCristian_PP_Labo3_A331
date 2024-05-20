
const delay = 3000; // DEFINO EL DELAY EN MILISEGUNDOS!

//Funcion para leer del localStorage
export function leer(key) {
    return new Promise((resolve,reject) => {
      setTimeout(() =>{
        try{
          const valor = JSON.parse(localStorage.getItem(key));
          resolve(valor);
        }
        catch(error){
          reject(error);
        }
      },delay);
    });
  }
  

  export function limpiar(key){
    return new Promise((resolve, reject)=>{
      setTimeout(() =>{
       try{
        localStorage.removeItem(key);
        resolve();
      }
      catch(error){
        reject(error);
      }
    },delay);
  });
}


  //Funcion para escribir al localStorage
  //key = string
  //valor = objeto
  export function escribir(key, valor) {
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        try{
          localStorage.setItem(key, JSON.stringify(valor));
          resolve();
        }
        catch(error){
          reject(error);
        }
      },delay);
    })
  }
  
  
  export function jsonToObject(jsonString) {
    return JSON.parse(jsonString);
  }
  
  export function objectToJson(objeto) {
    return JSON.stringify(objeto);
  }
