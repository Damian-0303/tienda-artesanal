

const productosGuardados = JSON.parse(localStorage.getItem("productos"));
let productos = productosGuardados ?? [];

const listaDeseosGuardada = JSON.parse(localStorage.getItem("listaDeseos"));
const listaDeseos = listaDeseosGuardada ?? [];

function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function guardarListaDeseos() {
  localStorage.setItem("listaDeseos", JSON.stringify(listaDeseos));
}

async function cargarProductos() {

  let errorCarga = false;
  
  try {
   

    Swal.fire({
    title: "Cargando productos...",
    text: "Estamos preparando el catálogo de Rosina Creaciones.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
   });
   


    if(productosGuardados){
      productos = productosGuardados;

    } else {

    const respuesta = await fetch("./data.json");

    if (!respuesta.ok){
      throw new Error("No se pudieron cargar los productos");
    }
    productos = await respuesta.json();
    guardarProductos();
  }
    
}  catch (error){

  errorCarga = true;
  console.error("Error al cargar los productos:", error);
} finally {
  Swal.close();
}

if (errorCarga) {
  Swal.fire({
    icon: "error",
    title: "Error de carga",
    text: "No se pudieron cargar los productos. Intentá nuevamente."
  });
} else {
 await Swal.fire({
    icon: "success",
    title: "¡Catálogo listo!",
    text: "Los productos se cargaron correctamente.",
    timer: 2000,
    showConfirmButton: false
  });
}
}
function mostrarBienvenida() {
  const mensaje = document.getElementById("mensajeBienvenida");

  mensaje.textContent = "¡Bienvenido a Rosina creaciones! Descubrí nuestros productos artesanales.";

  mensaje.classList.add("mostrar");

  setTimeout(() => {
    mensaje.classList.remove("mostrar");
  }, 4000);
}


function procesarDeseo(producto) {
  return new Promise((resolve, reject) => {
    setTimeout (() => {
     resolve(producto);
    }, 2000 );
 
  });

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
const estadoDeseos = document.getElementById("estadoDeseos");
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

async function agregarADeseos(idProducto) {
  const producto = productos.find(
    producto => producto.id === idProducto
  );

  if (!producto) {
    return;
  }

  const yaExiste = listaDeseos.some(
    productoDeseado => productoDeseado.id === idProducto
  );

  if (yaExiste){
    estadoDeseos.textContent = "Este producto ya está en tu lista de deseos.";
    return;
  }

  try {
    estadoDeseos.textContent = "⏳ Procesando tu solicitud...";

    const productoProcesado = await procesarDeseo(producto);

    listaDeseos.push(productoProcesado);

    guardarListaDeseos();
    renderizarListaDeseos();

    estadoDeseos.textContent = "✔️ Producto agregado correctamente.";

 } catch (error) {
  estadoDeseos.textContent =   "⚠️ No se pudo agregar el producto. Intentá nuevamente.";
  console.error("Error al agregar a deseos:", error);
} finally {
 
}
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



 Swal.fire({
  title:"¿Eliminar producto?",
  text: "Esta acción eliminará el producto del catálogo.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar"
 }).then((resultado) => {
  if (resultado.isConfirmed) {
    eliminarProducto(idProducto);

    cancelarEdicion();

     Swal.fire({
      icon: "success",
      title: "Producto eliminado",
      text: "El producto se eliminó correctamente.",
      timer: 2000,
      showConfirmButton: false
    });
  }

});
});




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



async function iniciarTienda(){
  await cargarProductos();

  renderizarProductos();
  renderizarListaDeseos();
  cargarProductosEnSelector();

  mostrarBienvenida();
}

iniciarTienda();
 

 
    
  


