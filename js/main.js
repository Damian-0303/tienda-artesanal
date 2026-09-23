// Array de objetos que representa los productos de la tienda 
const productos = [

    {
        nombre: "Pulsera",
        precio: 500,
        categoria: "Accesorios"
    },
    {
        nombre: "Collar",
        precio: 800,
        categoria: "Accesorios"
    },
    {
        nombre: "Cuadro",
        precio: 1200,
        categoria: "Decoración"
    },
    {
        nombre: "Porta velas",
        precio: 650,
        categoria: "Decoración"
    },
    {
        nombre: "Mate artesanal",
        precio: 950,
        categoria: "Hogar"
    }

];

//Solicita al usuario el nombre del producto que quiere buscar 
const nombreBuscado = prompt("¿Qué producto querés buscar?");
const productoBuscado = productos.find(
    producto => producto.nombre === nombreBuscado
);

if (productoBuscado) {
    console.log("Producto encontrado");
} else {
    console.log("Producto no disponible")
};

// Solicita al usuario una categoria para buscar 
const categoriaBuscada = prompt("¿Qué categría quieres buscar?");
const productosEncontrados = productos.filter(
    producto => producto.categoria === categoriaBuscada
);

console.log(productosEncontrados);

// Preparamos información de los productos para mostrar nombre y precio
const listadoProductos = productos.map(
    producto => producto.nombre + " - $" + producto.precio
);

console.log(listadoProductos);

// Mostramos el total de los productos 
const total = productos.reduce((acumulador, producto) => {
    return acumulador + producto.precio;
}, 0);

console.log("El total de los productos sumados es: " + total);
