# Holidays Friends

`Holidays Friends` is a comprehensive Point-of-Sale (POS) and Customer Relationship Management (CRM) application designed for bars, restaurants, and cafes. It provides a seamless, real-time experience for clients, waiters, and administrators.

This application was built using Firebase Studio and features a modern tech stack to ensure a fast, reliable, and scalable system.

## ✨ Key Features

- **Multi-Role System**: Dedicated interfaces and functionality for Clients, Waiters, and Administrators.
- **Real-time Ordering**: Clients and waiters can place orders that appear instantly on the admin dashboard without needing to refresh the page.
- **Dynamic Menu**: Customers can browse a dynamic menu, with real-time updates on product availability.
- **Product Management**: Administrators can easily add, edit, delete, and manage products, including stock levels and categories, with changes reflected across the app instantly.
- **User Management**: Admins can register and manage user accounts for waiters and other administrators, with support for temporary passwords.
- **Order Management**: A comprehensive dashboard for admins to track incoming orders, update their status (e.g., Pending, In Preparation, Completed, Paid), and view order history.
- **Reporting**: Admins can download sales and inventory reports in CSV format.
- **Customization**: The application's name, logo, and promotional images can be easily customized through the admin settings panel.
- **Authentication**: Secure login for waiters and administrators.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Database**: [Supabase](https://supabase.io/)
- **UI**: [React](https://reactjs.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Zustand (via a custom lightweight store implementation)
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

3.  **Set up Supabase**
    - Create a new project on [Supabase](https://supabase.io/).
    - In the SQL Editor, create tables for `products`, `users`, `orders`, and `settings`. You can infer the schema from the types defined in the `src/lib/` directory.
    - Go to **Authentication** > **Policies** and enable `SELECT` access for everyone on your tables to allow the app to read data.

4.  **Configure Environment Variables**
    - Create a `.env` file in the root of the project.
    - Go to your Supabase project's **Settings** > **API**.
    - Copy your **Project URL** and **anon key** into the `.env` file:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      ```

### Running the Application

To run the app in development mode, use the following command. This will start the application on `http://localhost:9002`.

```sh
npm run dev
```

## 📜 Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code for errors.
