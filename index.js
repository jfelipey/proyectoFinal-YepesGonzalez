let productos = [];
let carritoComp = [];

const menuElement = document.getElementById("menu");
document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    async function fetchData() {
        try {
            const response = await fetch('./products.json');
            productos = await response.json();
            displayProducts(productos);
            carritoLocalStorage();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayProducts(products) {
        products.forEach(product => {
    
            const nuevoElemento = document.createElement('div');
            nuevoElemento.id = 'product' + product.id;
            nuevoElemento.textContent = "Comprar " + product.nombre;
            const precioElemento = document.createElement('strong');
            precioElemento.textContent = " " + product.precioUnitario + " " + product.moneda + "   ";
            nuevoElemento.appendChild(precioElemento);
            const botonAgreProd = document.createElement('button');
            botonAgreProd.textContent = 'Agregar al carrito';
            botonAgreProd.type = 'button';
            botonAgreProd.id = 'product-button-' + product.id;
            nuevoElemento.appendChild(botonAgreProd);
            nuevoElemento.productAdded = false;
            var quantityInput = document.createElement('input');
            quantityInput.setAttribute("type", "number");
            quantityInput.setAttribute("value", 0);
            quantityInput.setAttribute("min", 0);
            quantityInput.id = product.id;
    
            botonAgreProd.addEventListener('click', () => {
                if (!nuevoElemento.productAdded) {
                    nuevoElemento.appendChild(quantityInput);
                    nuevoElemento.productAdded = true;
                    const productoAnadir = {
                        id: product.id,
                        quantity: +quantityInput.value
                    };
                    actualizarCarrito(productoAnadir);
                }
            });
        
            quantityInput.onchange = () => {
                const productoAnadir = {
                    id: product.id,
                    quantity: +quantityInput.value
                };
                actualizarCarrito(productoAnadir);
            };
            
            const carritoCompLocalStorage = localStorage.getItem('carritoComp');
            if (carritoCompLocalStorage) {
                const carritoJson = JSON.parse(carritoCompLocalStorage);
                const productoCarrito = carritoJson.find(itemCarrito =>  'product' + itemCarrito.id === nuevoElemento.id);
                    
                if (productoCarrito && productoCarrito.quantity !== 0) {
                    console.log(productoCarrito);
                    if (!nuevoElemento.productAdded) {
                        quantityInput.setAttribute('value', productoCarrito.quantity)
                        nuevoElemento.appendChild(quantityInput);
                        nuevoElemento.productAdded = true;
                    }
                    nuevoElemento.productAdded = true;
                    renderizarCarrito(productoCarrito);
                }
            }
            
            menuElement.appendChild(nuevoElemento);
        });
    }
});

const carritoElement = document.getElementById("carrito");
const confirmButton = document.getElementById("pagar");
confirmButton.disabled = true;
const payButton = document.createElement('button');
const checkoutElement = document.getElementById('checkout');

confirmButton.addEventListener('click', () => {
    const carrito = localStorage.getItem('carritoComp');
    let carritoJson = JSON.parse(carrito);
    let sumaTotal = 0;
    carritoJson.forEach(itemCarrito => {
        const producto = productos.find(item => item.id === itemCarrito.id);
        sumaTotal += producto.precioUnitario * itemCarrito.quantity;
    });
    const nuevoElemento = document.createElement('div');
    nuevoElemento.style.margin = '20px 0';
    const checkout = document.createElement('strong');
    checkout.textContent = "Valor total a pagar: " + sumaTotal + " USD";
    checkout.id = 'checkout-text';
    payButton.textContent = 'Pagar';
    const oldCheckout = document.getElementById(checkout.id);
    if (!oldCheckout) {
        nuevoElemento.appendChild(checkout);
    } else {
        oldCheckout.replaceWith(checkout);
    }
    nuevoElemento.appendChild(payButton);
    checkoutElement.appendChild(nuevoElemento);
});

payButton.addEventListener('click', () => {
    Swal.fire({
        title: '¡Compra realizada!',
        text: 'Tu pedido llegará pronto.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.reload();
        }
    });
});

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
    confirmButton.disabled = true;
    carritoJson.forEach(p => {
        if (p.quantity !== 0) {
            confirmButton.disabled = false;
        }
    });
    
    renderizarCarrito(productoAnadido);
}

function renderizarCarrito(productoAnadido) {
    const item = productos.find(p => p.id === productoAnadido.id);
    const nuevoElemento = document.createElement('div');
    nuevoElemento.id = 'producto-carrito-' + item.id;
    nuevoElemento.textContent = "Cantidad de " + item.plural + " comprados: ";
    const productQuantity = document.createElement('strong');
    productQuantity.textContent = productoAnadido.quantity + " / ";
    nuevoElemento.appendChild(productQuantity);
    nuevoElemento.appendChild(document.createTextNode("Precio total del producto: "));
    const totalPrice = document.createElement('strong');
    totalPrice.textContent = + item.precioUnitario * productoAnadido.quantity + " USD";
    nuevoElemento.appendChild(totalPrice);
    const oldElement = document.getElementById(nuevoElemento.id);
    if (!oldElement) {
        carritoElement.appendChild(nuevoElemento);
    } else {
        carritoElement.replaceChild(nuevoElemento, oldElement);
    }
}

function carritoLocalStorage() {
    const carritoCompLocalStorage = localStorage.getItem('carritoComp');
    const carritoCompLocalStorageJson = JSON.parse(carritoCompLocalStorage);
    if (!carritoCompLocalStorage) {
        return localStorage.setItem('carritoComp', '[]');
    } else {
        carritoCompLocalStorageJson.forEach(item => {
            if (item.quantity !== 0) {
                confirmButton.disabled = false;
            }
        });
        return carritoCompLocalStorage;
    }
}