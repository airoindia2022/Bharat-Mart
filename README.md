# Bharat Mart - B2B Marketplace

A full-stack MERN B2B marketplace application inspired by IndiaMart, featuring light/dark themes, user role management (Buyer, Seller, Admin), and Cloudinary integration for product images.

## Features
- **User Roles**: 
  - **Customer (Buyer)**: Browse products, search, send RFQs (Request for Quotation).
  - **Seller (Supplier)**: List products (pending admin approval), manage catalog, view inquiries from buyers.
  - **Admin**: Approve/Reject products, manage all users and products.
- **Image Storage**: Cloudinary integration for high-performance image handling.
- **Theming**: Premium Light and Dark mode support.
- **Production Ready**: JWT authentication, secure password hashing, and scalable structure.

## Tech Stack
- **Frontend**: React, Vite, Lucide Icons, Framer Motion, Vanilla CSS.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary, JWT.

## Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account (configured in `.env`).
- Cloudinary account (configured in `.env`).

``

### 3. Running the Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Running the Frontend
```bash
# In the root directory
npm install
npm run dev
```
The application will be available on the port provided by Vite (usually `http://localhost:5173`).

## Project Structure
- `backend/`: Express server, models, controllers, and routes.
- `src/`: React frontend with components and pages.
- `public/`: Static assets.
