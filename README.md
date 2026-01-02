# Restaurant Website

A complete restaurant website with menu management, billing, and sales reporting.

## How to Run Locally

### Method 1: Double-click index.html
Simply double-click `index.html` to open in your browser.

**Local URL:** `file:///C:/Users/Janani/Desktop/BUILDING%20WEBSITE/index.html`

### Method 2: Using Local Server (Recommended)

#### Using Python (if installed):
1. Double-click `start-server.bat`
2. Open browser and go to: `http://localhost:8000`

#### Using Node.js (if installed):
```bash
npx http-server -p 8000
```
Then open: `http://localhost:8000`

#### Using VS Code Live Server:
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` → "Open with Live Server"

## Website Features

- **Menu Display**: View all menu items with images
- **Shopping Cart**: Add items, adjust quantities
- **Billing**: Calculate totals, print bills
- **QR Payment**: UPI QR code for payment
- **Menu Management**: CRUD operations for menu items
- **Sales Report**: Monthly sales tracking and reports

## File Structure

```
BUILDING WEBSITE/
├── index.html          # Main menu & billing page
├── manage-menu.html    # Menu management page
├── sales-report.html   # Sales report page
├── css/
│   └── style.css       # All styling
└── js/
    ├── main.js         # Cart & billing logic
    ├── menu-manager.js # Menu CRUD operations
    └── sales-report.js # Sales report logic
```

## Mobile Responsive

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Edge
- Safari

