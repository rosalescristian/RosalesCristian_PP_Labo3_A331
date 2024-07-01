
const delay = 2500;

//Funcion para leer del localStorage
//key = string
//Returns Promise
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
  

//Funcion para limpiar el localStorage
//key = string
//Returns Promise
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
//Returns Promise
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
  
//Funcion convierte a JSON un String
//jsonString = String
//Returns JSON
export function jsonToObject(jsonString) {
  return JSON.parse(jsonString);
}

//Funcion convierte JSON a String
//objeto = JSON
//Returns String
export function objectToJson(objeto) {
  return JSON.stringify(objeto);
}
