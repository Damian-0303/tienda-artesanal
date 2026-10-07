// Array de objetos que representa los productos de la tienda
const productos = [
  {
    id: 1,
    nombre: "Pulsera",
    precio: 500,
    categoria: "Accesorios",
    cantidadDisponible: 8,
  },
  {
    id: 2,
    nombre: "Collar",
    precio: 800,
    categoria: "Accesorios",
    cantidadDisponible: 5,
  },
  {
    id: 3,
    nombre: "Cuadro",
    precio: 1200,
    categoria: "Decoración",
    cantidadDisponible: 3,
  },
  {
    id: 4,
    nombre: "Porta velas",
    precio: 650,
    categoria: "Decoración",
    cantidadDisponible: 1,
  },
  {
    id: 5,
    nombre: "Mate artesanal",
    precio: 950,
    categoria: "Hogar",
    cantidadDisponible: 9,
  },
];

const listaDeseos = [];

//Solicita al usuario el nombre del producto que quiere buscar
const nombreBuscado = "¿Qué producto querés buscar?";
const productoBuscado = productos.find(
  (producto) => producto.nombre === nombreBuscado,
);

if (productoBuscado) {
} else {
}

// Solicita al usuario una categoria para buscar
const categoriaBuscada = "¿Qué categría quieres buscar?";
const productosEncontrados = productos.filter(
  (producto) => producto.categoria === categoriaBuscada,
);

// Preparamos información de los productos para mostrar nombre y precio
const listadoProductos = productos.map(
  (producto) => producto.nombre + " - $" + producto.precio,
);

// Mostramos el total de los productos
const total = productos.reduce((acumulador, producto) => {
  return acumulador + producto.precio;
}, 0);

const inputNombre = document.getElementById("nombreProducto");
const inputPrecio = document.getElementById("precioProducto");
const inputCategoria = document.getElementById("categoriaProducto");
const botonAgregar = document.getElementById("btnAgregarProducto");
const contenedorItems = document.getElementById("contenedor-items");
const contenedorDeseos = document.getElementById("contenedor-deseos")

function renderizarProductos() {
  for (const producto of productos) {
    const productoHTML = `
            <div class="producto">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Categoria: ${producto.categoria}</p>
             <p>Cantidad disponible: ${producto.cantidadDisponible}</p>
             
             <button class="btn-deseos" data-id="${producto.id}">
             ♡ Agregar a lista de deseos
             </button>
            </div>
        `;

    contenedorItems.innerHTML += productoHTML;
  }
}

renderizarProductos();

const botonDeseos = document.querySelectorAll(".btn-deseos");

botonDeseos.forEach((boton) => {
  boton.addEventListener("click", function () {
    const idProducto = Number(boton.dataset.id);

    agregarADeseos(idProducto);
  });
});

function agregarADeseos(idProducto) {
  const producto = productos.find((producto) => producto.id === idProducto);

  if (producto === undefined) {
    return;
  }

  listaDeseos.push(producto);
}
