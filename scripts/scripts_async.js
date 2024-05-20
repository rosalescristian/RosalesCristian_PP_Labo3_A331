import { anuncio_Auto } from "./anuncio_Auto.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local_storage_async.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

let items = [];
let formulario = null;
const KEY_STORAGE = "autos";

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
        const model = new anuncio_Auto(
            obj.id,
            obj.titulo,
            obj.transaccion,
            obj.descripcion,
            obj.precio,
            obj.puertas,
            obj.kilometros,
            obj.potencia
        );
        items.push(model);
    });
    items = objetos.map((obj) => {
        return new anuncio_Auto(
            obj.id,
            obj.titulo,
            obj.transaccion,
            obj.descripcion,
            obj.precio,
            obj.puertas,
            obj.kilometros,
            obj.potencia
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

    const celdas = ["id", "titulo", "transaccion", "descripcion", "precio", "puertas", "kilometros", "potencia"];

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
        formulario.querySelector("#titulo").value = item.titulo;
        
        const transaccionVenta = formulario.querySelector("#venta");
        const transaccionAlquiler = formulario.querySelector("#alquiler");
        
        if (item.transaccion === "venta") {
            transaccionVenta.checked = true;
        } else if (item.transaccion === "alquiler") {
            transaccionAlquiler.checked = true;
        }

        formulario.querySelector("#descripcion").value = item.descripcion;
        formulario.querySelector("#precio").value = item.precio;
        formulario.querySelector("#puertas").value = item.puertas;
        formulario.querySelector("#kms").value = item.kilometros;
        formulario.querySelector("#potencia").value = item.potencia;

        // Elimina el evento de envío existente y agrega uno nuevo
        formulario.removeEventListener("submit", onSubmitEditar);
        formulario.addEventListener("submit", function onSubmitEditar(e) {
            e.preventDefault();
            
            const id = formulario.querySelector("#id").value;
            const itemIndex = items.findIndex((i) => i.id == id);

            if (itemIndex !== -1) {
                const fechaActual = new Date();
                const model = new anuncio_Auto(
                    id,
                    formulario.querySelector("#titulo").value,
                    formulario.querySelector('input[name="transaccion"]:checked').value,
                    formulario.querySelector("#descripcion").value,
                    formulario.querySelector("#precio").value,
                    formulario.querySelector("#puertas").value,
                    formulario.querySelector("#kms").value,
                    formulario.querySelector("#potencia").value,
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

/* function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fechaActual = new Date();

        const model = new anuncio_Auto(
            fechaActual.getTime(),
            formulario.querySelector("#titulo").value,
            formulario.querySelector('input[name="transaccion"]:checked').value,
            formulario.querySelector("#descripcion").value,
            formulario.querySelector("#precio").value,
            formulario.querySelector("#puertas").value,
            formulario.querySelector("#kms").value,
            formulario.querySelector("#potencia").value,
        );

        const rta = model.verify();

        if (rta) {
            mostrarSpinner();
            items.push(model);
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
    });
}
 */

function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fechaActual = new Date();
        const id = formulario.querySelector("#id").value;
        const modelIndex = items.findIndex((item) => item.id == id);

        if (modelIndex !== -1) {
            const model = items[modelIndex];
            model.titulo = formulario.querySelector("#titulo").value;
            model.transaccion = formulario.querySelector('input[name="transaccion"]:checked').value;
            model.descripcion = formulario.querySelector("#descripcion").value;
            model.precio = formulario.querySelector("#precio").value;
            model.puertas = formulario.querySelector("#puertas").value;
            model.kilometros = formulario.querySelector("#kms").value;
            model.potencia = formulario.querySelector("#potencia").value;

            const rta = model.verify();

            if (rta) {
                mostrarSpinner();
                items[modelIndex] = model;
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
        } else {
            alert("No se pudo encontrar el registro para editar.");
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
        <h1>Titulo de mi web</h1>`;
    return headerHTML;
}

function generarHTMLFooter() {
    const footerHTML = `
        <p>Todos los derechos reservados 2024 &copy | By Cristian Rosales - UTN : Laboratorio III - Simulacro</p>`;
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
