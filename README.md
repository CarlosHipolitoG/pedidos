# Holidays Friends - POS & CRM

`Holidays Friends` is a comprehensive Point-of-Sale (POS) and Customer Relationship Management (CRM) application designed for bars, restaurants, and cafes. Built as a self-contained demonstration, it provides a seamless, real-time experience for clients, waiters, and administrators using a local in-memory data simulation.

This application was built using Firebase Studio and features a modern tech stack to ensure a fast, reliable, and scalable system.

## ✨ Key Features

- **Multi-Role System**: Dedicated interfaces and functionality for Clients, Waiters, and Administrators.
- **Real-time Experience**: Orders and updates appear instantly across the application for all roles without needing to refresh the page, thanks to a reactive central state management system.
- **Dynamic Menu**: Customers and waiters can browse a dynamic menu, with real-time updates on product availability.
- **Full Product Management**: Administrators can easily add, edit, delete, and manage products, including stock levels, categories, and images. Changes are reflected across the app instantly.
- **Comprehensive User Management**: Admins can register and manage user accounts for waiters and other administrators, with support for temporary passwords for first-time login.
- **Complete Order Management**: A dashboard for admins and waiters to track incoming orders, update their status (e.g., Pending, In Preparation, Completed, Paid), and add new items to existing orders.
- **Reporting**: Admins can download sales and inventory reports in CSV format to analyze business performance.
- **Full Customization**: The application's name, logo, promotional banner images, and background can be easily customized through the admin settings panel.
- **Secure Authentication**: Simulated secure login for waiters and administrators.

## 🌊 Application Flow

The application is designed around three main user roles, each with a specific workflow.

### 1. Client Flow
- **Entry**: A new customer lands on the home page, where they can see promotional images. They enter their name and phone number to start.
- **Menu**: The client can browse the full menu, categorized for easy navigation.
- **Ordering**: They can add products to a shopping cart. Once ready, they confirm their order, which is then sent to the system.
- **Tracking**: After placing an order, the client can track its status in real-time (e.g., "En Preparación", "Completado"). They can add more items to their active order.
- **Order History**: Clients can look up their active orders using their phone number.

### 2. Waiter Flow
- **Login**: A waiter logs in with their email and password (which is initially their ID/cédula).
- **Customer Management**: The waiter first identifies the customer for whom they are placing an order by entering their name and phone number.
- **Order Taking**: The waiter browses the same menu as the client and adds items to an order on behalf of the customer.
- **Order Submission**: The order is sent to the system and appears on the admin dashboard.
- **Order History**: Waiters can view a list of all orders they have personally created.

### 3. Administrator Flow
- **Login**: The admin logs in with their credentials. Admins have the highest level of access.
- **Dashboard**: The admin sees a real-time overview of all incoming orders from both clients and waiters. They can filter orders by status.
- **Order Management**: They can change the status of any order (e.g., from "Pendiente" to "En Preparación"). They can also add products to any existing order or delete an order.
- **Product Management**: The admin has full CRUD (Create, Read, Update, Delete) control over the product menu. They can set names, prices, images, categories, and stock levels.
- **User Management**: The admin can create, edit, and delete user profiles for other admins and waiters.
- **Settings**: The admin can change the global settings of the application, such as the bar's name, logo, and promotional images.
- **Reporting**: Admins can download detailed CSV reports on total sales, sales by product, and current inventory levels.

## 💾 Data Architecture (Local Simulation)

This version of `Holidays Friends` runs in a **self-contained, server-based simulation mode**.
- **In-Memory Database**: Instead of connecting to an external database, the application uses a simple in-memory "database" managed by a Next.js API route located at `/src/app/api/data/route.ts`.
- **Data Persistence**: The data (products, users, orders) persists as long as the server is running. It will reset if the server is restarted.
- **Real-time Sync**: A client-side state management `store` (`src/lib/store.ts`) periodically polls the server API to keep all connected browser tabs in sync, creating a real-time experience.

This architecture makes the project incredibly easy to run and demonstrate without any external database setup.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://reactjs.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: A custom, lightweight reactive store (`src/lib/store.ts`) for real-time client-server synchronization.
- **Language**: TypeScript

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/holidays-friends.git
    cd holidays-friends
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

### Running the Application

To run the app in development mode, use the following command. This will start the application on `http://localhost:9002`.

```sh
npm run dev
```

The application is now running with its simulated in-memory database. All changes will be lost upon restarting the server.

## 📜 Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code for errors.
# hd
