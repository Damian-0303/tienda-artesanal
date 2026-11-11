
const productosIniciales = [
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

const productosGuardados = JSON.parse(localStorage.getItem("productos"));
const productos = productosGuardados ?? productosIniciales;

const listaDeseosGuardada = JSON.parse(localStorage.getItem("listaDeseos"));
const listaDeseos = listaDeseosGuardada ?? [];

function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function guardarListaDeseos() {
  localStorage.setItem("listaDeseos", JSON.stringify(listaDeseos));
}


const inputNombre = document.getElementById("nombreProducto");
const inputPrecio = document.getElementById("precioProducto");
const inputCategoria = document.getElementById("categoriaProducto");
const inputCantidadDisponible = document.getElementById("cantidadDisponible");
const botonAgregar = document.getElementById("btnAgregarProducto");
const botonCancelarEdicion = document.getElementById("btnCancelarEdicion");
const botonEliminarProducto = document.getElementById("btnEliminarProducto");
const botonAdminisracion = document.getElementById("btnAdministracion");
const panelAdministracion = document.getElementById("panelAdministracion");
const contenedorItems = document.getElementById("contenedor-items");
const contenedorDeseos = document.getElementById("contenedor-deseos");
const botonVaciarDeseos = document.getElementById("btnVaciarDeseos");
const mensajeFormulario = document.getElementById("mensajeFormulario")
const buscadorProductos = document.getElementById("buscadorProductos");
const seleccionarProducto = document.getElementById("seleccionarProducto");
let productoEnEdicion = null;


function renderizarProductos(listaProductos = productos) {

    contenedorItems.innerHTML="";
  for (const producto of listaProductos) {
    const {nombre, precio, categoria, cantidadDisponible } = producto
    const estadoStock = cantidadDisponible > 0 
    ? `Cantidad disponible: ${cantidadDisponible}`
    : "Sin stock";
    const productoHTML = `
            <div class="producto">
            <h3>${nombre}</h3>
            <p>Precio: $${precio}</p>
            <p>Categoria: ${categoria}</p>
             <p>${estadoStock}</p>
             
             <button class="btn-deseos" data-id="${producto.id}">
             ♡ Agregar a lista de deseos
             </button>
             
            </div>
        `;

    contenedorItems.innerHTML += productoHTML;
  }
}

renderizarProductos();
renderizarListaDeseos();
cargarProductosEnSelector();

function cargarProductosEnSelector(){
  seleccionarProducto.innerHTML = '<option value="">Seleccionar producto</option>';

  productos.forEach(producto => {
    seleccionarProducto.innerHTML +=  `<option value="${producto.id}">${producto.nombre}</option>
    `;
  });
}

seleccionarProducto.addEventListener("change", function (){
  const idProducto = Number(seleccionarProducto.value);

  const productoSeleccionado = productos.find(
    producto => producto.id === idProducto
  );

  if (!productoSeleccionado) {
    return;
  }
  inputNombre.value = productoSeleccionado.nombre;
  inputPrecio.value = productoSeleccionado.precio;
  inputCategoria.value = productoSeleccionado.categoria;
  inputCantidadDisponible.value = productoSeleccionado.cantidadDisponible;
  productoEnEdicion = idProducto;
  botonAgregar.textContent = "Guardar cambios";
  botonCancelarEdicion.hidden = false;
});


contenedorItems.addEventListener("click", function (evento){
    if(evento.target.classList.contains("btn-deseos")) {
        const idProducto = Number(evento.target.dataset.id);

        agregarADeseos(idProducto);
    }
});

contenedorDeseos.addEventListener("click", function (evento){
  if (evento.target.classList.contains("btn-eliminar-deseo")){
    const idProducto = Number(evento.target.dataset.id);

    eliminarDeDeseos(idProducto);
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
  guardarListaDeseos();
  renderizarListaDeseos();
}

function eliminarDeDeseos (idProducto){
  const indice = listaDeseos.findIndex(
    producto => producto.id === idProducto
  );

  if (indice === -1){
    return;
}
    listaDeseos.splice(indice, 1);

    guardarListaDeseos();
    renderizarListaDeseos();
  
}

function eliminarProducto (idProducto){
  const indice = productos.findIndex(
    producto => producto.id === idProducto
  );

  if (indice === -1) {
    return;
  }

  productos.splice(indice, 1);

  const indiceDeseo = listaDeseos.findIndex(
    producto => producto.id === idProducto
  );

  if (indiceDeseo !== -1){
    listaDeseos.splice(indiceDeseo, 1);
  }

  guardarProductos();
  guardarListaDeseos();

  renderizarProductos();
  renderizarListaDeseos();
  cargarProductosEnSelector();

}

botonEliminarProducto.addEventListener("click", function (){
  const idProducto = Number(seleccionarProducto.value);

  if (!idProducto){
    mensajeFormulario.textContent = "Seleccioná un producto para eliminar.";
    mensajeFormulario.className = "mensaje-error";
    return;

  }

  const confirmar = confirm("¿Estas seguro que quieres elminiar este producto?");
  
  if (confirmar) {
    eliminarProducto(idProducto);

    cancelarEdicion();

    mensajeFormulario.textContent = "Producto eliminado correctamente.";
    mensajeFormulario.className = "mensaje-exito"
  }
}

);

function vaciarListaDeseos() {
  listaDeseos.length = 0;

  guardarListaDeseos();

  renderizarListaDeseos();
}

botonVaciarDeseos.addEventListener("click", vaciarListaDeseos);

function renderizarListaDeseos() {
    contenedorDeseos.innerHTML = "";

    for (const producto of listaDeseos) {
        const productoHTML =  `
        <div class="producto-deseado">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <button class="btn-eliminar-deseo" data-id="${producto.id}">
        Eliminar
        </button>
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
        id: productoEnEdicion === null
        ? Date.now()
        : productoEnEdicion,
        nombre,
        precio,
        categoria,
        cantidadDisponible
        
    };
    
    if (productoEnEdicion === null){
      productos.push(nuevoProducto);
    } else {
      const indice = productos.findIndex(
        producto => producto.id === productoEnEdicion
      );
      productos[indice] = nuevoProducto;

      const indiceDeseo = listaDeseos.findIndex(
        producto => producto.id === productoEnEdicion
      );

      if (indiceDeseo !== -1){
        listaDeseos[indiceDeseo] = nuevoProducto;
      }
    }

    guardarProductos();
    guardarListaDeseos();
    renderizarProductos();
    renderizarListaDeseos();
    cargarProductosEnSelector();

    productoEnEdicion = null;
    botonAgregar.textContent = "Agregar producto";
    botonCancelarEdicion.hidden = true;
   

   mensajeFormulario.textContent = "¡Producto agregado correctamente!";
   mensajeFormulario.className = "mensaje-exito";
   
    inputNombre.value = "";
    inputPrecio.value = "";
    inputCantidadDisponible.value = "";
}

function cancelarEdicion(){
  productoEnEdicion = null;

  inputNombre.value ="";
  inputPrecio.value ="";
  inputCantidadDisponible.value ="";

  seleccionarProducto.value ="";

  botonAgregar.textContent = "Agregar producto";
  botonCancelarEdicion.hidden = true;

  mensajeFormulario.textContent ="";
  
}

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

botonAgregar.addEventListener("click", agregarProducto);

buscadorProductos.addEventListener("input", function (){
    const textoBusqueda = buscadorProductos.value.toLowerCase().trim();

    const productosFiltrados = productos.filter(producto => 
      producto.nombre.toLocaleLowerCase().includes(textoBusqueda)  
    );

    renderizarProductos(productosFiltrados);
});

