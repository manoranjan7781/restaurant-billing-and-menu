let menuItems = [];
let editingId = null;

// Load menu items from localStorage
function loadMenuItems() {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
        menuItems = JSON.parse(stored);
    } else {
        // Initialize with default menu items if none exist with correct food images from open source
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
    renderMenuList();
}

// Render menu list
function renderMenuList() {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';

    if (menuItems.length === 0) {
        menuList.innerHTML = '<p class="no-data">No menu items. Add your first item!</p>';
        return;
    }

    menuItems.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'menu-list-item';

        listItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(item.name)}" 
                 alt="${item.name}" 
                 class="menu-list-item-image"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=' + encodeURIComponent('${item.name}')">
            <div class="menu-list-item-name">${item.name}</div>
            <div class="menu-list-item-price">₹${item.price.toFixed(2)}</div>
            <div class="menu-list-item-actions">
                <button class="btn btn-primary btn-small" onclick="editItem('${item.id}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteItem('${item.id}')">Delete</button>
            </div>
        `;

        menuList.appendChild(listItem);
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const image = document.getElementById('item-image').value.trim();

    if (!name || isNaN(price) || price < 0) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    if (editingId) {
        // Update existing item
        const index = menuItems.findIndex(item => item.id === editingId);
        if (index !== -1) {
            menuItems[index] = {
                id: editingId,
                name: name,
                price: price,
                image: image || menuItems[index].image
            };
        }
        editingId = null;
    } else {
        // Add new item
        const newItem = {
            id: Date.now().toString(),
            name: name,
            price: price,
            image: image || 'https://via.placeholder.com/200'
        };
        menuItems.push(newItem);
    }

    // Save to localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems));

    // Reset form
    document.getElementById('menu-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('save-btn').textContent = 'Add Item';
    document.getElementById('cancel-btn').style.display = 'none';

    // Re-render list
    renderMenuList();
}

// Edit item
function editItem(id) {
    const item = menuItems.find(item => item.id === id);
    if (!item) return;

    editingId = id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-image').value = item.image || '';
    document.getElementById('save-btn').textContent = 'Update Item';
    document.getElementById('cancel-btn').style.display = 'inline-block';

    // Scroll to form
    document.querySelector('.manage-section').scrollIntoView({ behavior: 'smooth' });
}

// Delete item
function deleteItem(id) {
    const item = menuItems.find(item => item.id === id);
    if (!item) return;

    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        menuItems = menuItems.filter(item => item.id !== id);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        renderMenuList();
    }
}

// Cancel edit
function cancelEdit() {
    editingId = null;
    document.getElementById('menu-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('save-btn').textContent = 'Add Item';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();

    // Form event listener
    document.getElementById('menu-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancel-btn').addEventListener('click', cancelEdit);
});

// Make functions globally available for onclick handlers
window.editItem = editItem;
window.deleteItem = deleteItem;

