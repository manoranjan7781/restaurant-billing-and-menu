// Initialize menu items and cart
let cart = [];
let menuItems = [];

// Load menu items from localStorage
function loadMenuItems() {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
        menuItems = JSON.parse(stored);
    } else {
        // Initialize with default menu items with correct food images from open source
        menuItems = [
            { id: '1', name: 'Idly', price: 30, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Idli_with_Sambar_and_Coconut_Chutney.jpg/800px-Idli_with_Sambar_and_Coconut_Chutney.jpg' },
            { id: '2', name: 'Puttu', price: 40, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Puttu.jpg/800px-Puttu.jpg' },
            { id: '3', name: 'Poori', price: 35, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Poori_%28deep_fried_flat_bread%29.jpg/800px-Poori_%28deep_fried_flat_bread%29.jpg' },
            { id: '4', name: 'Coffee', price: 20, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=800&fit=crop&q=80' },
            { id: '5', name: 'Dosa', price: 50, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Dosa_with_Sambar_and_Coconut_Chutney.jpg/800px-Dosa_with_Sambar_and_Coconut_Chutney.jpg' },
            { id: '6', name: 'Vada', price: 25, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Vada.jpg/800px-Vada.jpg' },
            { id: '7', name: 'Pazhampori', price: 45, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=800&fit=crop&q=80' }
        ];
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }
}

// Render menu items
function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.onclick = () => addToCart(item);

        menuItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}'}" 
                 alt="${item.name}" 
                 class="menu-item-image"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}'">
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">₹${item.price.toFixed(2)}</div>
            </div>
        `;

        menuGrid.appendChild(menuItem);
    });
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    updateCartDisplay();
    updateCartButtons();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateCartButtons();
}

// Update quantity
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
    }
    updateCartDisplay();
    updateCartButtons();
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">₹${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-subtotal">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    cartTotal.textContent = calculateTotal().toFixed(2);
}

// Update cart buttons state
function updateCartButtons() {
    const hasItems = cart.length > 0;
    document.getElementById('pay-now-btn').disabled = !hasItems;
    document.getElementById('print-bill-btn').disabled = !hasItems;
    document.getElementById('clear-cart-btn').disabled = !hasItems;
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        updateCartDisplay();
        updateCartButtons();
    }
}

// Show QR modal
function showQRModal() {
    const modal = document.getElementById('qr-modal');
    modal.style.display = 'block';
}

// Close QR modal
function closeQRModal() {
    const modal = document.getElementById('qr-modal');
    modal.style.display = 'none';
}

// Complete payment
function completePayment() {
    if (cart.length === 0) return;

    // Create order object
    const order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: calculateTotal()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Show success message
    alert('Payment completed! Order saved.');
    
    // Clear cart and close modal
    cart = [];
    updateCartDisplay();
    updateCartButtons();
    closeQRModal();
}

// Print bill
function printBill() {
    if (cart.length === 0) return;

    // Create bill HTML
    const billHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bill</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 400px;
                    margin: 20px auto;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .bill-header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                }
                .bill-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                .bill-total {
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 2px solid #333;
                    font-size: 1.2em;
                    font-weight: bold;
                    text-align: right;
                }
                .bill-footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="bill-header">
                <h1>Restaurant Bill</h1>
                <p>Date: ${new Date().toLocaleString()}</p>
            </div>
            <div class="bill-items">
                ${cart.map(item => `
                    <div class="bill-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="bill-total">
                Total: ₹${calculateTotal().toFixed(2)}
            </div>
            <div class="bill-footer">
                <p>Thank you for your visit!</p>
            </div>
        </body>
        </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    renderMenu();
    updateCartDisplay();
    updateCartButtons();

    // Event listeners
    document.getElementById('pay-now-btn').addEventListener('click', showQRModal);
    document.getElementById('print-bill-btn').addEventListener('click', printBill);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
    document.getElementById('payment-complete-btn').addEventListener('click', completePayment);
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeQRModal);
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('qr-modal');
        if (event.target === modal) {
            closeQRModal();
        }
    });
});

// Make functions globally available for onclick handlers
window.updateQuantity = updateQuantity;

