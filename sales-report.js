let orders = [];

// Load orders from localStorage
function loadOrders() {
    const stored = localStorage.getItem('orders');
    if (stored) {
        orders = JSON.parse(stored);
    }
    populateYearFilter();
    filterOrders();
}

// Populate year filter
function populateYearFilter() {
    const yearSelect = document.getElementById('year-select');
    const years = new Set();
    
    orders.forEach(order => {
        const year = new Date(order.date).getFullYear();
        years.add(year);
    });

    // Add current year if no orders exist
    if (years.size === 0) {
        years.add(new Date().getFullYear());
    }

    // Sort years descending
    const sortedYears = Array.from(years).sort((a, b) => b - a);

    yearSelect.innerHTML = '<option value="">All Years</option>';
    sortedYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Filter orders by month and year
function filterOrders() {
    const month = document.getElementById('month-select').value;
    const year = document.getElementById('year-select').value;

    let filteredOrders = [...orders];

    if (month) {
        filteredOrders = filteredOrders.filter(order => {
            const orderMonth = new Date(order.date).getMonth() + 1;
            return orderMonth.toString().padStart(2, '0') === month;
        });
    }

    if (year) {
        filteredOrders = filteredOrders.filter(order => {
            const orderYear = new Date(order.date).getFullYear();
            return orderYear.toString() === year;
        });
    }

    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderReport(filteredOrders);
    updateSummary(filteredOrders);
}

// Render report table
function renderReport(filteredOrders) {
    const tbody = document.getElementById('report-tbody');

    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No sales data available for the selected period</td></tr>';
        return;
    }

    tbody.innerHTML = filteredOrders.map(order => {
        const date = new Date(order.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const itemsList = order.items.map(item => 
            `${item.name} (${item.quantity}x)`
        ).join(', ');

        return `
            <tr>
                <td>${formattedDate}</td>
                <td>#${order.id.slice(-6)}</td>
                <td>${itemsList}</td>
                <td>₹${order.total.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

// Update summary
function updateSummary(filteredOrders) {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toFixed(2)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();

    // Filter button event listener
    document.getElementById('filter-btn').addEventListener('click', filterOrders);

    // Auto-filter on month/year change
    document.getElementById('month-select').addEventListener('change', filterOrders);
    document.getElementById('year-select').addEventListener('change', filterOrders);
});

