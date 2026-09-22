
# 🛍️ MERN E-Commerce Platform

### A full-stack, production-deployed e-commerce application built with React, Node.js, Express, and MongoDB.

<p>
  <a href="https://e-commerce-platform-six-phi.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Store-Visit%20Store-111827?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Store">
  </a>
  <a href="https://e-commerce-platform-b11c.vercel.app">
    <img src="https://img.shields.io/badge/Admin%20Panel-Open%20Dashboard-111827?style=for-the-badge&logo=vercel&logoColor=white" alt="Admin Panel">
  </a>
  <a href="https://e-commerce-platform-3ndl.vercel.app">
    <img src="https://img.shields.io/badge/Backend%20API-API%20Online-111827?style=for-the-badge&logo=vercel&logoColor=white" alt="Backend API">
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Cloudinary-Image%20Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary">
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
</p>

</div>

---

## 🌐 Live Applications

| Application | Description | Link |
|---|---|---|
| 🛍️ **Customer Storefront** | Browse products, manage cart, checkout and place orders | **[Visit Store →](https://e-commerce-platform-six-phi.vercel.app)** |
| 🛠️ **Admin Panel** | Manage products and view/update customer orders | **[Open Admin →](https://e-commerce-platform-b11c.vercel.app)** |
| ⚙️ **Backend API** | Express REST API powering both applications | **[Open API →](https://e-commerce-platform-3ndl.vercel.app)** |
| 📦 **Source Code** | Complete project repository | **[GitHub →](https://github.com/demoxavi12/e-commerce-platform)** |

> **Demo note:** The deployed checkout currently uses Cash on Delivery (COD). Razorpay test-mode configuration is prepared for online-payment development.

---

## 📸 Screenshots

Add 2–4 screenshots of the deployed application here when you have them. Recommended screenshots:

- Customer storefront / homepage
- Product details or collections
- Cart / checkout
- Admin dashboard / order management

---

# 📌 Overview

This project is a full-stack e-commerce platform designed to demonstrate practical **MERN stack development**, REST API design, authentication, database integration, cloud image storage, admin workflows, and production deployment.

The system is divided into three applications:

- **Client** — customer-facing shopping experience
- **Admin** — product and order management dashboard
- **Server** — REST API for authentication, products, carts, and orders

The production system uses **MongoDB Atlas** for persistent data, **Cloudinary** for product images, and **Vercel** for deployment.

---

# ✨ Features

## 👤 Customer

- User registration and login
- JWT-based authentication
- Product browsing and collections
- Product details
- Shopping cart
- Cart quantity management
- Remove items from cart
- Checkout
- Cash on Delivery
- Order placement
- Order history
- Order status

## 🛠️ Admin

- Admin authentication
- Protected admin routes
- Product creation
- Product image upload
- Product management
- Customer order management
- Order status updates

### Order Status Flow

```text
Order Placed
     ↓
  Packing
     ↓
  Shipped
     ↓
Out for Delivery
     ↓
 Delivered
```

## ⚙️ Backend

- RESTful API
- JWT authentication
- MongoDB/Mongoose integration
- Product CRUD operations
- Cart APIs
- Order APIs
- Cloudinary integration
- CORS configuration
- Production deployment

---

# 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express.js, REST APIs, JWT |
| **Database** | MongoDB, MongoDB Atlas, Mongoose |
| **Image Storage** | Cloudinary |
| **Payments** | Razorpay test-mode integration prepared, Cash on Delivery |
| **Deployment** | Vercel |
| **Version Control** | Git, GitHub |
| **Development** | VS Code, Postman |

---

# 🏗️ Architecture

```text
                         ┌────────────────────────┐
                         │   Customer Frontend    │
                         │      React + Vite      │
                         └────────────┬───────────┘
                                      │
                                      │ REST API
                                      ▼
                         ┌────────────────────────┐
                         │     Express Backend    │
                         │        Node.js         │
                         └────────────┬───────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
             ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
             │  MongoDB    │  │ Cloudinary  │  │  Razorpay   │
             │    Atlas    │  │   Images    │  │   Payments  │
             └─────────────┘  └─────────────┘  └─────────────┘
                                      ▲
                                      │ REST API
                                      │
                             ┌────────┴────────┐
                             │   Admin Panel   │
                             │   React + Vite  │
                             └─────────────────┘
```

---

# 📂 Project Structure

```text
e-commerce-platform/
│
├── client/                 # Customer-facing React application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── admin/                  # Admin dashboard
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🔐 Authentication & Authorization

The application uses **JWT-based authentication** to protect user and admin functionality.

Protected areas include:

- Customer accounts
- Cart operations
- Order operations
- Admin routes
- Product management
- Order management

Admin functionality is separated from the customer application and protected through backend authorization.

---

# 🛒 Shopping & Order Workflow

```text
Customer
   │
   ▼
Browse Products
   │
   ▼
Product Details
   │
   ▼
Add to Cart
   │
   ▼
Checkout
   │
   ▼
Place COD Order
   │
   ▼
MongoDB Atlas
   │
   ▼
Admin Dashboard
   │
   ▼
Update Order Status
```

---

# 🖼️ Product Image Management

Product images are uploaded to **Cloudinary** instead of being stored directly inside the Git repository.

```text
Admin
  │
  ▼
Upload Product Image
  │
  ▼
Express Backend
  │
  ▼
Cloudinary
  │
  ▼
Image URL
  │
  ▼
MongoDB Product Document
```

This keeps the Git repository lightweight while allowing product images to be served through cloud storage.

---

# 🗄️ Database

The production application uses **MongoDB Atlas** with **Mongoose**.

The database stores information related to:

- Users
- Products
- Carts
- Orders

---

# 🔌 API Structure

The backend exposes REST endpoints organized by resource:

```text
/api/user
/api/product
/api/cart
/api/order
```

| Route | Purpose |
|---|---|
| `/api/user` | Authentication and user operations |
| `/api/product` | Product operations |
| `/api/cart` | Cart operations |
| `/api/order` | Order operations |

---

# 💳 Payment

The project includes **Razorpay test-mode configuration** for online payment development.

The current deployed demonstration primarily uses:

```text
Cash on Delivery (COD)
```

This keeps the public demo usable without requiring real payment transactions.

---

# 🚀 Deployment

The application is deployed as three separate Vercel projects:

```text
┌──────────────────────────────┐
│    Customer Frontend         │
│          Vercel              │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Backend API            │
│          Vercel              │
└───────┬──────────────┬───────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌──────────────┐
│ MongoDB Atlas│  │  Cloudinary  │
└──────────────┘  └──────────────┘

┌──────────────────────────────┐
│       Admin Panel            │
│          Vercel              │
└──────────────┬───────────────┘
               │
               ▼
          Backend API
```

### Production Services

| Service | Purpose |
|---|---|
| **Vercel** | Frontend and backend deployment |
| **MongoDB Atlas** | Production database |
| **Cloudinary** | Product image storage |
| **GitHub** | Source control |
| **Razorpay** | Payment integration |

---

# 💻 Local Development

## Prerequisites

- Node.js
- npm
- Git
- MongoDB Atlas account
- Cloudinary account

## 1. Clone the Repository

```bash
git clone https://github.com/demoxavi12/e-commerce-platform.git
cd e-commerce-platform
```

## 2. Install Dependencies

### Backend

```bash
cd server
npm install
```

### Customer Frontend

```bash
cd ../client
npm install
```

### Admin Panel

```bash
cd ../admin
npm install
```

---

# 🔑 Environment Variables

## Backend

Create:

```text
server/.env
```

```env
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

JWT_SECRET=your_jwt_secret

NODE_ENV=development

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

## Client

Create:

```text
client/.env
```

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Admin

Create:

```text
admin/.env
```

```env
VITE_BACKEND_URL=http://localhost:4000
```

> ⚠️ **Never commit `.env` files, credentials, database passwords, or API secrets to GitHub.**

---

# ▶️ Running Locally

### Start Backend

```bash
cd server
npm start
```

### Start Customer Application

Open another terminal:

```bash
cd client
npm run dev
```

### Start Admin Application

Open another terminal:

```bash
cd admin
npm run dev
```

---

# 🧪 Testing

The main customer and admin workflows have been tested.

### Customer

- Registration
- Login
- Product browsing
- Product details
- Cart operations
- Checkout
- COD order placement
- Order history

### Admin

- Admin login
- Product creation
- Cloudinary image upload
- Product management
- Order viewing
- Order status updates

### Production Integration

The deployed system has been verified across:

- Customer frontend
- Admin frontend
- Backend API
- MongoDB Atlas
- Cloudinary
- Cross-application API communication

---

# 🔒 Security Considerations

The application uses:

- JWT authentication
- Protected API routes
- Admin authorization
- Environment variables for secrets
- HTTPS through Vercel
- MongoDB Atlas authentication
- Cloudinary for external image storage

> This is a portfolio/demo application. Additional security hardening, monitoring, rate limiting, automated testing, and operational controls would be appropriate before commercial production use.

---

# 📈 Future Improvements

- Online payment processing
- Product reviews and ratings
- Wishlist
- Advanced search
- Advanced filtering
- Inventory management
- Email notifications
- Product recommendations
- Dedicated order tracking
- Automated unit and integration testing
- Admin analytics
- Improved accessibility
- Performance optimization
- Additional API security and rate limiting

---

# 🎯 What This Project Demonstrates

This project demonstrates practical experience with:

- Full-stack MERN development
- REST API design
- React application architecture
- JWT authentication
- Role-based access
- MongoDB data modeling
- Cloudinary integration
- Shopping cart architecture
- Order processing
- Admin dashboard development
- Environment configuration
- Git/GitHub workflows
- Cloud deployment
- Production debugging
- Vercel serverless deployment

---

# 👨‍💻 Author

<div align="center">

### Swaraj Xavier Suna

**B.Tech — Computer Science & Engineering**  
NIST University

[GitHub](https://github.com/demoxavi12) •
[LinkedIn](https://www.linkedin.com/in/swaraj-6009a8332/) •
[LeetCode](https://leetcode.com/u/swaraj_xavier_suna/)

</div>

---

# 📄 License

This project was developed for **educational and portfolio purposes**.

---

<div align="center">

⭐ If you found this project useful, consider giving the repository a star!

</div>
