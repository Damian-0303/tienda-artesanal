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
   {
    id: 6,
    nombre: "Rosario",
    precio: 800,
    categoria: "Accesorios",
    cantidadDisponible: 12,
  },
];

const listaDeseos = [

];


const inputNombre = document.getElementById("nombreProducto");
const inputPrecio = document.getElementById("precioProducto");
const inputCategoria = document.getElementById("categoriaProducto");
const inputCantidadDisponible = document.getElementById("cantidadDisponible");
const botonAgregar = document.getElementById("btnAgregarProducto");
const botonAdminisracion = document.getElementById("btnAdministracion");
const panelAdministracion = document.getElementById("panelAdministracion")
const contenedorItems = document.getElementById("contenedor-items");
const contenedorDeseos = document.getElementById("contenedor-deseos");
const mensajeFormulario = document.getElementById("mensajeFormulario")
const buscadorProductos = document.getElementById("buscadorProductos");

function renderizarProductos(listaProductos = productos) {

    contenedorItems.innerHTML="";
  for (const producto of listaProductos) {
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


contenedorItems.addEventListener("click", function (evento){
    if(evento.target.classList.contains("btn-deseos")) {
        const idProducto = Number(evento.target.dataset.id);

        agregarADeseos(idProducto);
    }
});

function agregarADeseos(idProducto) {
  const producto = productos.find((producto) => producto.id === idProducto);

  if (producto === undefined) {
    return;
  }

  const yaExiste = listaDeseos.some (
    productoDeseado => productoDeseado.id === idProducto
  );

  if (yaExiste){
    return;
  }

  listaDeseos.push(producto);
  renderizarListaDeseos();
}

function renderizarListaDeseos() {
    contenedorDeseos.innerHTML = "";

    for (const producto of listaDeseos) {
        const productoHTML =  `
        <div class="producto-deseado">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        </div>
        `

        contenedorDeseos.innerHTML += productoHTML;
    }
}

botonAdminisracion.addEventListener("click", function (){
    panelAdministracion.hidden = !panelAdministracion.hidden;
});
function validarProducto(nombre, precio, cantidadDisponible) {
  return (
    nombre !== "" && 
    precio > 0 && 
    Number.isFinite(precio) && 
    Number.isInteger(cantidadDisponible) &&
    cantidadDisponible >= 0
  );

}
function agregarProducto(){
    const nombre = inputNombre.value.trim();
    const precio = Number(inputPrecio.value);
    const categoria = inputCategoria.value;
    const cantidadDisponible = Number(inputCantidadDisponible.value);

   if (
    inputPrecio.value === "" || 
    inputCantidadDisponible.value === "" ||
    !validarProducto(nombre, precio, cantidadDisponible)
   ){

    mensajeFormulario.textContent = 
    "Revisá los datos: ingresá un nombre , un precio mayor que cero y una cantidad válida."
    mensajeFormulario.className = "mensaje-error";
    return;

   }

    const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        precio,
        categoria,
        cantidadDisponible
        
    };

    productos.push(nuevoProducto);

    renderizarProductos();

    mensajeFormulario.textContent = "¡Producto agregado correctamente!";
    mensajeFormulario.className= "mensaje-exito"
    inputNombre.value = "";
    inputPrecio.value = "";
    inputCantidadDisponible.value = "";
}

botonAgregar.addEventListener("click", agregarProducto);

buscadorProductos.addEventListener("input", function (){
    const textoBusqueda = buscadorProductos.value.toLowerCase().trim();

    const productosFiltrados = productos.filter(producto => 
      producto.nombre.toLocaleLowerCase().includes(textoBusqueda)  
    );

    renderizarProductos(productosFiltrados);
});