// Creamos la clase Carrito
class Carrito{
    constructor(){
        this.obtenerDeLocalStorage();
        this.total = 0;
        // Llamo a listar y al contador apenas inicia la aplicación
        this.listar();
        
    }

    enCarrito(nuevoProducto) {
        //Me ejecuta la funcion de EnCarrito solo si el array no esta vacio (Esto es para prevenir errores en la cantidad de productos)
        if (this.productos != []){
            return this.productos.find((producto) => {
                if (producto.nombre == nuevoProducto.nombre) {
                  return true;
                }
                return false;
              });
        }
    }

    //Le paso la lista de productos para que quede guardado en el metodo
    agregar(nuevoProducto){
        let productoEncontrado = this.enCarrito(nuevoProducto);
        if (productoEncontrado){
            productoEncontrado.cantidad += 1;
            productoEncontrado.precio = nuevoProducto.precio;
            productoEncontrado.subtotal = nuevoProducto.precio * productoEncontrado.cantidad;
            this.guardarEnLocalStorage();
        } else {
            //Si el producto no esta en el carrito, se agrega al array
            this.productos.push(nuevoProducto);
            // Guardo en el storage el array actualizado
            this.guardarEnLocalStorage();
        }
        
    }

    // Vamos a intentar almacenar los datos del this.productos para que pueda llamarlos en el momento en que los necesite

    // MUY buena implementación del storage

    guardarEnLocalStorage() {
        const arrayString = JSON.stringify(this.productos);
        localStorage.setItem('productos', arrayString);
    }
    
    obtenerDeLocalStorage() {
        const arrayString = localStorage.getItem('productos');
        this.productos = JSON.parse(arrayString) || [];
    }

    listar(){
        // Este algoritmo solo se ejecuta si nos encontramos en la página checkout.html
        // Es recomendable usar Live Server (Go live) para correr la aplicación por el tema de los directorios
        //Se agrego /proyectoSoot/ ya que se ha creado el repositorio
        if (path == "/proyectoSoot/checkout.html"){
            console.log("Estoy en el checkout"); 
            this.obtenerDeLocalStorage();
            //Se crea una variable self ya que la variable this trae conflictos dentro del evento unload (Fuente chatGPT)
            let self = this;
            //Si la pagina se recarga, tambien se eliminan los elementos vacios y asi se evita que se anexe al html un elemento vacio o indefinido
            window.addEventListener('unload', function(event) {
                self.productos.forEach((producto, indice)=>{
                    if(producto === ""){
                        self.productos.splice(indice, 1)
                        self.guardarEnLocalStorage();
                    }
                })
                // Código a ejecutar cuando la página se recargue
                console.log('La página se está recargando');
                // Ejecuta aquí el código adicional que deseas realizar después de la recarga
              });
              
            this.contador();
            this.productos.forEach((producto, indice) => {
                cajaCheckoutCarrito.innerHTML += `
                <div class="checkout__tarjeta" id="tarjeta${indice}">
                    <img class="imgCocktails" src="${producto.imagen}" alt="">
                    <div class="checkout__caja">
                        <p>${producto.nombre} </p>
                        <p>$${producto.precio}</p>
                        <div class="checkout__cantidad">
                            <button class="checkout__cantidad--boton menosCantidad">-</button>
                            <p class="cantidad">${producto.cantidad}</p>
                            <button class="checkout__cantidad--boton masCantidad">+</button>
                        </div>
                    </div>
                </div>`
            });
            const cantidad = document.querySelectorAll(".cantidad")
            //Creamos el elemento menos cantidad
            const menosCantidad = document.querySelectorAll(".menosCantidad");
            //Convertimos el elemento a un Array para poder obtener los indices
            let menosCantidadArray = [...menosCantidad]
            //Recorremos el array guardando los elementos en la variable disminuir
            menosCantidadArray.forEach((disminuir)=>{
                //Guardamos en la variable indice Boton todos los indices de la variable disminuir
                let indiceBotonResta = menosCantidadArray.indexOf(disminuir);
                disminuir.addEventListener("click", ()=>{
                    //Al hacer click, le enviamos a la funcion quitarCantidad los indices como parametro
                    this.quitarCantidad(indiceBotonResta);
                    this.actualizar(cantidad);
                });
            })
            //Creamos el elemento mas cantidad
            const masCantidad = document.querySelectorAll(".masCantidad");
            //Convertimos el elemento a un Array para poder obtener los indices
            let masCantidadArray = [...masCantidad]
            //Recorremos el array guardando los elementos en la variable aumentar
            masCantidadArray.forEach((aumentar)=>{
                //Guardamos en la variable indice Boton todos los indices de la variable aumentar
                let indiceBotonSuma = masCantidadArray.indexOf(aumentar);
                aumentar.addEventListener("click", ()=>{
                    //Al hacer click, le enviamos a la funcion quitarCantidad los indices como parametro
                    this.sumarCantidad(indiceBotonSuma);
                    this.actualizar(cantidad);
                });
            });
            //Se crea un Else para indicar que cuando el usuario no este en el checkout, que se eliminen los elementos vacios del array
        } else {
            this.productos.forEach((producto, indice)=>{
                if(producto === ""){
                    this.productos.splice(indice, 1)
                    this.guardarEnLocalStorage();
                }
            })
        } 
    }

    actualizar(cantidad){
        //Le paso los paraemtros que necesito a la funcion actualizar, la cual se inicializa luego de que se presionan los botones + y - cantidad
        //Obtengo del local storage el array definitivo
        this.obtenerDeLocalStorage();
        //Recorro el array guarando cada objeto en la variable producto
        this.productos.forEach((producto)=>{
            //Creo y guardo los indices de cada producto en la variable indiceProducto
            let indiceProducto = this.productos.indexOf(producto)
            //Convierto el nodelist cantidad en un array y lo guardo en cantidadArray (Cantidad es el query selector del parrafo a actualizar)
            let cantidadArray = [...cantidad];
            //Recorro mi array guardando cada elemento en la variable indiceCantidad
            cantidadArray.forEach((indiceCantidad)=>{
                //Creo una variable que almacene los indices de indiceCantidad (Los parrafos)
                let ordenCantidad = cantidadArray.indexOf(indiceCantidad);
                //Le indico que si el indice del producto es igual al indice del parrafo 
                //(Siempre va a ser asi por el orden en que los parrafos se crean, independientemente del producto que sea)
                //Me ponga la cantidad actualizada del producto en cuestion
                if ((indiceProducto === ordenCantidad) && (producto.cantidad > 0)){
                    indiceCantidad.innerText = producto.cantidad
                } 
            })
        });
        this.contador();
    }

    quitarCantidad(indiceBotonResta){
        //Recorro el array this.productos guardando cada objeto en la variable producto
        // console.log("INDICE BOTON " + indiceBotonResta)
        this.productos.forEach((producto)=>{
            //Creo y guardo en la variable indiceProducto, cada indice de cada objeto
            let indiceProducto = this.productos.indexOf(producto);
            //Le indico que si el indice del producto es igual al indice del boton de resta pase la siguiente condicion
            if (indiceProducto == indiceBotonResta){
                //Guardo el producto en question que quiero quitar cantidad
                let productoAQuitar = producto
                // console.log("INDICE DEL PRODUCTO A QUITAR " + indiceProducto)
                if (productoAQuitar.cantidad > 1){
                    //Le quito la cantidad al producto
                    productoAQuitar.cantidad -= 1;
                } else {
                    //Se elimina el producto del array y se reemplaza por un elemento vacio
                    this.productos.splice(indiceProducto, 1, '');
                    // Se aplica una clase para ocultar el div y de esa manera, no perder el orden de los indices de los div
                    const tarjetaProducto = document.getElementById(`tarjeta${indiceProducto}`)
                    tarjetaProducto.innerHTML = " ";
                }
                //Guardo el array actualizado en el storage
                this.guardarEnLocalStorage();
            }
        })
    }
    sumarCantidad(indiceBotonSuma){
        //Recorro el array this.productos guardando cada objeto en la variable producto
        this.productos.forEach((producto)=>{
            //Creo y guardo en la variable indiceProducto, cada indice de cada objeto
            let indiceProducto = this.productos.indexOf(producto);
            //Le indico que si el indice del producto es igual al indice del boton de resta pase la siguiente condicion
            if (indiceProducto == indiceBotonSuma){
                //Guardo el producto en question que quiero sumar cantidad
                let productoAQuitar = producto
                //Le quito la cantidad al producto
                productoAQuitar.cantidad += 1;
                //Guardo el array actualizado en el storage
                this.guardarEnLocalStorage();
            }
        })
    }
    contador(){
        this.total = this.productos.reduce((acumulador, producto) => {
            if(producto != ''){
                // El return se utiliza para devolver el valor actualizado de la variable acumulador luego que se cumpla la condicion if
                // esto evita que se sumen elementos vacios
                return acumulador + producto.precio * producto.cantidad
            }
            //Else implicito, se devuelve solamente acumulador sin sumarse las cantidades del elemento vacio
            return acumulador;
            
        }, 0);
        botonCompra.innerText = "$" + this.total;
        console.log(this.productos);
    }
}
// Obtener la ruta de acceso y el archivo actual
const path = window.location.pathname;
console.log(path); // Imprime la ruta de acceso y el archivo actual en la consola
// Los productos los ponemos fuera de cualquier función para que sean globales, y así
// poder acceder a ellos desde cualquier parte de nuestra aplicación

// Clase "molde" para crear los productos
function Producto(nombre, precio, cantidad, imagen, id){
    this.nombre = nombre;
    this.precio = parseInt(precio);
    this.cantidad = cantidad;
    this.imagen = imagen;
    this.id = id;
}

// Productos
let gaiaMa = new Producto("Gaia Ma", 25, 1, "sources/gaiaMa.jpg", 0);
let martini = new Producto("Martini", 22, 1, "sources/martini.jpeg", 1);
let aperolSpritz = new Producto("Aperol Spritz", 25, 1, "sources/aperol-spritz.jpeg", 3);
let cubaLibre = new Producto("Cuba Libre", 25, 1, "sources/cuba-libre.jpeg", 4);
let ginTonic = new Producto("Gin & Tonic", 25, 1, "sources/gin-tonic.jpeg", 5);
let mojito = new Producto("Mojito", 25, 1, "sources/mojito.jpeg", 6);
let hugo = new Producto("Hugo", 25, 1, "sources/hugo.jpeg", 7);
let smokyPaloma = new Producto("Smoky Paloma", 25, 1, "sources/smokyPaloma.jpeg", 8);
let margarita = new Producto("Margarita", 25, 1, "sources/margarita.png", 9);

// Elementos
const botonGaiaMa = document.querySelector("#gaiaMa");
const botonMartini = document.querySelector("#martini");
const cajaCheckoutCarrito = document.querySelector("#checkoutCajaCarrito");
const botonCompra = document.querySelector("#botonCompra");
const botonAperolSpritz = document.querySelector("#aperolSpritz");
const botonCubaLibre = document.querySelector("#cubaLibre");
const botonGinTonic = document.querySelector("#ginTonic");
const botonMojito = document.querySelector("#mojito");
const btnHugo = document.querySelector("#hugo");
const btnSmokyPaloma = document.querySelector("#smokyPaloma");
const btnMargarita = document.querySelector("#margarita");



// Eventos
if (botonGaiaMa){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    botonGaiaMa.addEventListener("click", function(){
        carrito.agregar(gaiaMa);
    });
}
if (botonMartini){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    botonMartini.addEventListener("click", function(){
        carrito.agregar(martini);
    });
}
if (botonAperolSpritz){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    botonAperolSpritz.addEventListener("click", function(){
        carrito.agregar(aperolSpritz);
    });
}
if (botonCubaLibre){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    botonCubaLibre.addEventListener("click", function(){
        carrito.agregar(cubaLibre);
    });
}
if (botonGinTonic){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    botonGinTonic.addEventListener("click", function(){
        carrito.agregar(ginTonic);
    });
}
if (botonMojito){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    botonMojito.addEventListener("click", function(){
        carrito.agregar(mojito);
    });
}
if (btnHugo){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    btnHugo.addEventListener("click", function(){
        carrito.agregar(hugo);
    });
}
if (btnSmokyPaloma){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    btnSmokyPaloma.addEventListener("click", function(){
        carrito.agregar(smokyPaloma);
    });
}
if (btnMargarita){ // Le pongo un condicional porque si estoy en otra página ese elemento tal vez no exista
    btnMargarita.addEventListener("click", function(){
        carrito.agregar(margarita);
    });
}




//Para limpiar el local storage =
//localStorage.clear();
 



// Creo el objeto carrito. Es conveniente crearlo a lo último, cosa que ya estén todos
// los elementos inicializados, variables globales declaradas, y todo listo para usar
const carrito = new Carrito();
console.log(carrito.productos)

//Bugs solucionados:
/*
30/06/2023 : 

Soluciones a Bugs =
- Se arreglo el problema de los indices de los productos, botones y divs que se 
modificaban al eliminar un producto del carrito. Ahora todo se muestra correctamente
ya que se agrega un elemento vacio al eliminar el producto para asi conservar los 
indices

- Se corrigio el problema de la recarga en el checkout que mostraba el elemento vacio,
al recargar la pagina, se elimina el objeto vacio en el array y se actualizan los indices de
los productos, botones y divs y de esta manera, continuan vinculados

- Se corrigio el problema del contador que me sumaba objetos vacios al acumulador y me tiraba NaN,
ahora se ejecuta correctamente

Actualizaciones = 
Se implemento el uso del repositorio GIT para poder seguir con los cambios de una manera mas organizada



















*/