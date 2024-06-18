// Definición de variables de cantidad de productos
let cantProd = 0;
let cantAlf = 0;
let cantChe = 0;
let cantPos = 0;
let cantTor = 0;
let opc = 0;
let cantComp = 0;

// Función Vaciar

function vaciar() {
    carritoComp = []
}

let carritoComp = carritoLocalStorage();

const productos = [ 
    {id:1, nombre: "alfajores", precioUnitario: 2, moneda: "USD"},
    {id:2, nombre: "chesecake de limón", precioUnitario: 4, moneda: "USD"},
    {id:3, nombre: "postre de 3 leches", precioUnitario: 6, moneda: "USD"},
    {id:4, nombre: "torta de chocolate", precioUnitario: 9, moneda: "USD"}
]

 const pago = function() {
    let totalApagar = 0;
    carritoComp.forEach(prod => {
        totalApagar = totalApagar + (prod.precioUnitario * prod.cantidad)
    });

    return totalApagar
}

const menuElement = document.getElementById("menu");
const carritoElement = document.getElementById("carrito");
const confirmButton = document.getElementById("pagar");
confirmButton.disabled = true;
const payButton = document.createElement('button');

productos.forEach(producto => {
    
    const nuevoElemento = document.createElement('div');
    
        nuevoElemento.textContent = "Comprar " + producto.nombre;
        const precioElemento = document.createElement('strong');
        precioElemento.textContent = " " + producto.precioUnitario + " " + producto.moneda + "   ";
        nuevoElemento.appendChild(precioElemento);
        const botonAgreProd = document.createElement('button');
        botonAgreProd.textContent = 'Agregar al carrito';
        botonAgreProd.type='button';
        botonAgreProd.id = producto.id;
        nuevoElemento.appendChild(botonAgreProd);
        nuevoElemento.productAdded = false;
        var quantityInput = document.createElement('input');
        quantityInput.setAttribute("type", "number");
        quantityInput.setAttribute("value", 0);
        quantityInput.id = producto.id;

        botonAgreProd.addEventListener('click', () => {
            if (!nuevoElemento.productAdded) {
                nuevoElemento.appendChild(quantityInput);
                nuevoElemento.productAdded = true;
                const productoAnadir = {
                    id: producto.id,
                    quantity: +quantityInput.value
                };
                actualizarCarrito(productoAnadir);
            }
        });

        quantityInput.onchange = () => {
            const productoAnadir = {
                id: producto.id,
                quantity: +quantityInput.value
            };
            actualizarCarrito(productoAnadir);
        };
    
    menuElement.appendChild(nuevoElemento);
});

confirmButton.addEventListener('click', () => {
    const carrito = localStorage.getItem('carritoComp');
    let carritoJson = JSON.parse(carrito);
    let sumaTotal = 0;
    carritoJson.forEach(itemCarrito => {
        const producto = productos.find(item => item.id === itemCarrito.id);
        sumaTotal += producto.precioUnitario * itemCarrito.quantity;
    });
    const nuevoElemento = document.createElement('div');
    const checkout = document.createElement('strong');
    checkout.textContent = "Valor total a pagar: " + sumaTotal + " USD";
    payButton.textContent = 'Pagar';
    nuevoElemento.appendChild(checkout);
    nuevoElemento.appendChild(payButton);
    carritoElement.appendChild(nuevoElemento);
});

payButton.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload()
});


function renderizarCarrito(productoAnadido) {
    const item = productos.find(p => p.id === productoAnadido.id);
    const texto = document.getElementById("texto-" + productoAnadido.id);
    texto.style.display = "block";
    const cantidad = document.getElementById("cantidad-" + productoAnadido.id);
    cantidad.style.display = "block";
    cantidad.innerHTML = productoAnadido.quantity + " / Precio total producto: " + item.precioUnitario * productoAnadido.quantity + " USD";
}

function actualizarCarrito(productoAnadido) {
    const carrito = localStorage.getItem('carritoComp');
    let carritoJson = JSON.parse(carrito);
    const item = carritoJson.find(p => p.id === productoAnadido.id);
    if (!item) {
        carritoJson.push(productoAnadido);
    } else {
        item.quantity = productoAnadido.quantity;
        const itemIndex = carritoJson.findIndex(p => p.id === item.id);
        carritoJson[itemIndex] = item;
    }
    localStorage.setItem('carritoComp', JSON.stringify(carritoJson));
    carritoJson.forEach(p => {
        if (p.quantity !== 0) {
            confirmButton.disabled = false;
        }
    });
    
    renderizarCarrito(productoAnadido);
}

function carritoLocalStorage() {
    return localStorage.setItem('carritoComp', '[]');
}

