const cors = require("cors"); // Importa el paquete cors
const express = require("express");
const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

let items = [
  {
    id: 1,
    nombre: "Bitcoin",
    simbolo: "BTC",
    fechaCreacion: "2009-01-03",
    precioActual: 35000,
    consenso: "Prueba de trabajo",
    cantidadCirculacion: 18600000,
    algoritmo: "SHA-256",
    sitioWeb: "https://bitcoin.org",
  },
  {
    id: 2,
    nombre: "Ethereum",
    simbolo: "ETH",
    fechaCreacion: "2015-07-30",
    precioActual: 2500,
    consenso: "Prueba de participación",
    cantidadCirculacion: 115000000,
    algoritmo: "Ethash",
    sitioWeb: "https://ethereum.org",
  },
  {
    id: 3,
    nombre: "Cardano",
    simbolo: "ADA",
    fechaCreacion: "2017-09-29",
    precioActual: 1.5,
    consenso: "Prueba de participación",
    cantidadCirculacion: 32000000000,
    algoritmo: "Ouroboros",
    sitioWeb: "https://cardano.org",
  },
  {
    id: 4,
    nombre: "Ripple",
    simbolo: "XRP",
    fechaCreacion: "2012-02-02",
    precioActual: 0.6,
    consenso: "Acuerdo de consenso",
    cantidadCirculacion: 100000000000,
    algoritmo: "Ripple Protocol",
    sitioWeb: "https://ripple.com",
  },
  {
    id: 5,
    nombre: "Litecoin",
    simbolo: "LTC",
    fechaCreacion: "2011-10-13",
    precioActual: 150,
    consenso: "Prueba de trabajo",
    cantidadCirculacion: 66000000,
    algoritmo: "Scrypt",
    sitioWeb: "https://litecoin.org",
  },
];

// Middleware para simular una demora de 3 segundos
const simulateDelay = (req, res, next) => {
  setTimeout(next, 3000);
};

/**
 * Obtiene todas los items
 */
app.get("/monedas", simulateDelay, (req, res) => {
  res.json(items);
});

/**
 * Crea una nueva Casa
 */
app.post("/monedas", simulateDelay, (req, res) => {
  const nuevaCasa = req.body;
  nuevaCasa.id = items.length + 1;
  items.push(nuevaCasa);
  res.status(200).json(nuevaCasa);
});

/**
 * Obtiene Casa por ID
 */
app.get("/monedas/:id", simulateDelay, (req, res) => {
  const id = parseInt(req.params.id);
  const casa = items.find((p) => p.id === id);
  if (casa) {
    res.json(casa);
  } else {
    res.status(404).send("Item no encontrado");
  }
});

/**
 * Edita item por ID
 */
app.put("/monedas/:id", simulateDelay, (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex((p) => p.id === id);
  if (index !== -1) {
    const newObj = req.body;
    newObj.id = id;
    items[index] = newObj;

    res.json(newObj);
  } else {
    res.status(404).send("No encontrado");
  }
});

/**
 * Elimina item por ID
 */
app.delete("/monedas/:id", simulateDelay, (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex((p) => p.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    res.status(200).send();
  } else {
    res.status(404).send("No encontrado");
  }
});

/**
 * Elimina todas los item
 */
app.delete("/monedas", simulateDelay, (req, res) => {
  items = [];
  res.status(200).send("Todos los items han sido eliminados");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
