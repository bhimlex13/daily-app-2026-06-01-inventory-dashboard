# 📦 Inventorio Pro - Full Stack Inventory Management

![Inventorio Pro Dashboard](./docs/screenshots/Dashboard.png)

**Inventorio Pro** is a modern, responsive, full-stack inventory management system and Point of Sale (POS) application. Built with the MERN stack (MongoDB, Express, React, Node.js) and styled with a stunning dark-mode-first glassmorphism design using Tailwind CSS. 

It provides business owners with real-time stock tracking, category management, automated alerts, and seamless checkout experiences.

---

## ✨ Features

### 1. 📊 Interactive Dashboard
- **Bird's Eye View**: Track Total Products, Total Inventory Value, Low Stock Items, and Out of Stock alerts.
- **Dynamic Charts**: Visualize inventory distribution and category values using Recharts.
- **Recent Alerts**: Immediately identify which items need re-stocking with quick-action tables.

### 2. 🛒 Point of Sale (POS) System
- **Rapid Checkout**: Click-to-add product grid with custom category color coding.
- **Cart Management**: Easily increment/decrement quantities and remove items.
- **Payment Processing**: Log sales via Cash or Card and instantly deduct stock from the database.
- **Smart Filtering**: Live search by name/SKU or filter by category directly in the POS.

### 3. 📦 Advanced Product Management
- **Full CRUD**: Create, read, update, and delete inventory items.
- **Visual Stock Gauges**: Health bars visually represent stock levels against minimum requirements.
- **Image Uploads**: Upload and store product images via Multer for quick identification.

### 4. 🧾 Transaction History
- **Digital Ledger**: Automatically records every POS transaction with timestamps, total amounts, and payment methods.
- **Order Details**: See exactly what items (and how many) were sold in every receipt.

### 5. 🏷️ Category Management
- **Custom Categorization**: Group your products effectively.
- **Color Coding**: Assign hex colors to categories via a color picker; these colors dynamically style product cards across the app.

### 6. 🔒 Security & Authentication
- **Secure Access**: JWT-based authentication ensures only authorized admins can access the portal.
- **Encrypted Data**: Passwords and sensitive data are safely handled.

---

## 🛠️ Technology Stack

**Frontend (Client)**
- **React.js** (Vite) - UI Framework
- **Tailwind CSS v4** - Styling and layout
- **Lucide React** - Modern iconography
- **Recharts** - Data visualization
- **Axios** - API communication
- **React Router** - Navigation

**Backend (Server)**
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - NoSQL Database
- **JSON Web Tokens (JWT)** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - Image upload handling

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (Local instance running on `mongodb://127.0.0.1:27017/` or MongoDB Atlas)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/bhimlex13/daily-app-2026-06-01-inventory-dashboard.git
cd daily-app-2026-06-01-inventory-dashboard

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/inventory-dashboard
JWT_SECRET=your_super_secret_jwt_key_change_me
```

### 3. Running the App

Open two terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`. 
*(Note: A default admin user `admin` / `admin` is seeded into the database on the first run).*

---

## 📖 Documentation

For detailed usage instructions, please refer to the [User Manual](./docs/USER_MANUAL.md) located in the `docs` folder. A PDF version is also provided.

---
*Built autonomously by Antigravity AI.*
