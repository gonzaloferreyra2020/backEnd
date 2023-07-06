const express = require('express');
const fs = require('fs');

// Importa la clase ProductManager desde el archivo correspondiente
const ProductManager = require('./ProductManager.js').default;

// Crea una instancia de Express
const app = express();
const port = 8080; // Puedes cambiar el puerto si lo deseas

// Endpoint para obtener todos los productos
app.get('/products', (req, res) => {
  // Lee el archivo de productos
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al leer los productos');
    }

    // Parsea el contenido del archivo JSON
    const products = JSON.parse(data);

    // Verifica si se especificó un límite en la consulta
    const limit = req.query.limit;

    // Si no se especifica límite o es inválido, devuelve todos los productos
    if (!limit || isNaN(limit)) {
      return res.json(products);
    }

    // Devuelve los primeros 'limit' productos
    return res.json(products.slice(0, limit));
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
