import { Crypto } from "./Crypto.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local_storage_async.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

let items = [];
let formulario = null;
const KEY_STORAGE = "cryptos";

window.addEventListener("DOMContentLoaded", onInit);

function onInit() {
    includeNavBar();
    includeHeader();
    includeFooter();
    actualizarFormulario();
    obtenerFormulario();
    escuchandoFormulario();
    escuchandoBtnDeleteAll();
    escuchandoClickFila();
    loadItems();
}

async function loadItems() {
    mostrarSpinner();
    let str = await leer(KEY_STORAGE) || "[]";
    const objetos = jsonToObject(str) || [];

    objetos.forEach(obj => {
        const model = new Crypto(
            obj.id,
            obj.nombre,
            obj.simbolo,
            obj.fechaCreacion,
            obj.precioActual,
            obj.consenso,
            obj.cantidad,
            obj.algoritmo,
            obj.web
        );
        items.push(model);
    });
    items = objetos.map((obj) => {
        return new Crypto(
            obj.id,
            obj.nombre,
            obj.simbolo,
            obj.fechaCreacion,
            obj.precioActual,
            obj.consenso,
            obj.cantidad,
            obj.algoritmo,
            obj.web
        );
    });
    rellenarTabla();
    ocultarSpinner();
}

function rellenarTabla() {
    mostrarSpinner();
    const tabla = document.getElementById("table-items");
    const tbody = tabla.getElementsByTagName("tbody")[0];
    tbody.innerHTML = '';

    const celdas = ["id", "nombre", "simbolo", "fechaCreacion", "precioActual", "consenso", "cantidad", "algoritmo", "web"];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");
        nuevaFila.setAttribute("data-id", item.id);

        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda];
            nuevaFila.appendChild(nuevaCelda);
        });

        let celdaEditar = document.createElement("td");
        let botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.classList.add("btn-editar");
        celdaEditar.appendChild(botonEditar);

        let celdaBorrar = document.createElement("td");
        let botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar";
        botonBorrar.classList.add("btn-borrar");
        celdaBorrar.appendChild(botonBorrar);

        nuevaFila.appendChild(celdaEditar);
        nuevaFila.appendChild(celdaBorrar);

        tbody.appendChild(nuevaFila);
    });
    ocultarSpinner();
}

function escuchandoClickFila() {
    const tabla = document.getElementById("table-items");
    tabla.addEventListener("click", (e) => {
        const fila = e.target.closest("tr");
        if (fila) {
            const id = fila.getAttribute("data-id");
            if (e.target.classList.contains("btn-editar")) {
                editarRegistro(id);
            } else if (e.target.classList.contains("btn-borrar")) {
                borrarRegistro(id);
            }
        }
    });
}

function editarRegistro(id) {
    const itemIndex = items.findIndex((i) => i.id == id);
    if (itemIndex !== -1) {
        const item = items[itemIndex];

        // Llena el formulario con los datos del registro seleccionado
        formulario.querySelector("#id").value = item.id;
        formulario.querySelector("#nombre").value = item.nombre;
        formulario.querySelector("#simbolo").value = item.simbolo;
        formulario.querySelector("#precioActual").value = item.precioActual;
        formulario.querySelector("#cantidad").value = item.cantidad;
        formulario.querySelector("#web").value = item.web;
        
        const nombre = formulario.querySelector("#nombre").value;
        const simbolo = formulario.querySelector("#simbolo").value;
        const precioActual = formulario.querySelector("#precioActual").value;
        const consenso = formulario.querySelector("#consenso").value;
        const cantidad = formulario.querySelector("#cantidad").value;
        const algoritmo = formulario.querySelector("#algoritmo").value;
        const web = formulario.querySelector("#web").value;

        // Elimina el evento de envío existente y agrega uno nuevo
        formulario.removeEventListener("submit", onSubmitEditar);
        formulario.addEventListener("submit", function onSubmitEditar(e) {
            e.preventDefault();
            
            const id = formulario.querySelector("#id").value;
            const itemIndex = items.findIndex((i) => i.id == id);

            if (itemIndex !== -1) {
                const fechaActual = new Date();
                const model = new Crypto(
                    id,
                    nombre,
                    simbolo,
                    fechaCreacion,
                    precioActual,
                    consenso,
                    cantidad,
                    algoritmo,
                    web
                );

                const rta = model.verify();

                if (rta) {
                    mostrarSpinner();
                    // Actualiza el registro existente en el array
                    items[itemIndex] = model;
                    const str = objectToJson(items);
                    try {
                        escribir(KEY_STORAGE, str);
                        actualizarFormulario();
                        rellenarTabla();
                    } catch (error) {
                        alert(error);
                    }
                    ocultarSpinner();
                } else {
                    alert("Error en la carga de datos! Hay información incorrecta o incompleta. Verifique.");
                }
            }
        });
    }
}

function borrarRegistro(id) {
  const index = items.findIndex((i) => i.id == id);
  if (index !== -1) {
      const rta = confirm('¿Desea eliminar este registro?');
      if (rta) {
          items.splice(index, 1);
          mostrarSpinner();
          escribir(KEY_STORAGE, objectToJson(items))
              .then(() => {
                  rellenarTabla();
                  ocultarSpinner();
              })
              .catch((error) => {
                  alert(error);
                  ocultarSpinner();
              });
      }
  }
}

function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const id = new Date();
        const nombre = formulario.querySelector("#nombre").value;
        const simbolo = formulario.querySelector("#simbolo").value;
        const fechaCreacion = new Date().toLocaleDateString();
        const precioActual = formulario.querySelector("#precioActual").value;
        const consenso = formulario.querySelector("#consenso").value;
        const cantidad = formulario.querySelector("#cantidad").value;
        const algoritmo = formulario.querySelector("#algoritmo").value;
        const web = formulario.querySelector("#web").value;
        
        // Buscar si ya existe un elemento con el mismo id
        const modelIndex = items.findIndex((item) => item.id == id);
        
        if (modelIndex !== -1) {
            editarRegistro()
        } else {
            // Crear un nuevo modelo
            const newModel = new Crypto(
                id,
                nombre,
                simbolo,
                fechaCreacion,
                precioActual,
                consenso,
                cantidad,
                algoritmo,
                web
            );

            const rta = newModel.verify();

            if (rta) {
                mostrarSpinner();
                items.push(newModel);
                const str = objectToJson(items);
                try {
                    await escribir(KEY_STORAGE, str);
                    actualizarFormulario();
                    rellenarTabla();
                } catch (error) {
                    alert(error);
                }
                ocultarSpinner();
            } else {
                alert("Error en la carga de datos! Hay información incorrecta o incompleta. Verifique.");
            }
        }
    });
}


function actualizarFormulario() {
    if (formulario) {
        formulario.reset();
    }
}

function obtenerFormulario() {
    formulario = document.getElementById("form-item");
    return formulario;
}

function limpiarTabla() {
    const table = document.getElementById("table-items");
    table.innerHTML = '';
}

function escuchandoBtnDeleteAll(){
  const btn = document.getElementById("btn-delete-all");
  btn.addEventListener("click", async (e) => {
      const rta = confirm('Desea eliminar por completo todos los items?');
      mostrarSpinner();
      if (rta) {
          items.splice(0, items.length);
          try {
              await limpiar(KEY_STORAGE);
              rellenarTabla();
          } catch (error) {
              alert(error);
          }
      }
      ocultarSpinner();
  });
}


/*      LOGICA NAVBAR - HEADER Y FOOTER     */

function generarNavBar() {
    const navBarHTML = `
        <nav>
            <ul>
                <li><a href="#">Nosotros</a></li>
                <li><a href="#">Anuncios</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contacto</a></li>
            </ul>
        </nav>`;
    return navBarHTML;
}

function generarHTMLHeader() {
    const headerHTML = `
        <h2>Administrador de<br>Monedas</h2>`;
    return headerHTML;
}

function generarHTMLFooter() {
    const footerHTML = `
        <p>Todos los derechos reservados 2024 &copy | By Cristian Rosales - UTN : Laboratorio III - 1er Parcial</p>`;
    return footerHTML;
}

function includeNavBar() {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const navBar = generarNavBar();

    header.innerHTML = navBar;
    footer.innerHTML = navBar;
}

function includeHeader() {
    const header = document.getElementById('header');
    const headerContent = generarHTMLHeader();
    header.innerHTML += headerContent;
}

function includeFooter() {
    const footer = document.getElementById('footer');
    const footerContent = generarHTMLFooter();
    footer.innerHTML += footerContent;
}
