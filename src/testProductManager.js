import ProductManager from './ProductManager.js';

const manager = new ProductManager('products.json');

console.log("Obtener los productos: ",manager.getProducts());

const product = {
    title: 'televisor',
    description: 'electrodomestico',
    price: 75000,
    thumbnail: 'imagen.jpg',
    code: 'tv2023',
    stock: 10,
};
manager.addProduct(product);

// Obtener los productos 
console.log("Productos cargados: ",manager.getProducts());

// Obtener por id
const productId = 1;
const foundProduct = manager.getProductById(productId);
console.log("Producto por ID: ",foundProduct);

// Actualizar precio
const updatedProduct = { price: 95000 };
manager.updateProduct(productId, updatedProduct);
console.log("NUEVO PRECIO $: ",product.price)

// Eliminar producto
manager.deleteProduct(productId);
console.log("Productos eliminados: ",manager.getProducts());