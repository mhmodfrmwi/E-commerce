# E-commerce API

This project is an e-commerce API built with Express.js, providing functionalities for user authentication, product management, category management, order processing, and more. The API allows users to register, browse products and categories, place orders, and manage their accounts, while admins can manage all aspects of the e-commerce system.

## Features

- User Authentication: Register, login, and verify user accounts.
- Product Management: CRUD operations for products (Admins only).
- Category Management: CRUD operations for product categories (Admins only).
- Order Management: Create, update, and delete orders, view user orders, and calculate total sales.
- Profile Management: Update user profile photo.
- Image Upload: Upload single or multiple images for products, categories, and user profiles.

## Technologies Used

- **Node.js** with **Express.js** for the backend.
- **MongoDB** as the database.
- **Mongoose** for MongoDB object modeling.
- **JWT (JSON Web Token)** for authentication and authorization.
- **Multer** for handling image uploads.
- **Morgan** for HTTP request logging.
- **Nodemailer** for sending emails.
- **Cloudinary** for storing images.

## Prerequisites

- **Node.js** and **npm** installed on your system.
- A MongoDB instance (local or remote).
- Environment variables configured in a `.env` file.

## Getting Started

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```sh
   cd e-commerce-api
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Create a `.env` file in the root of the project and add the following variables:

   ```
   PORT=<your_port>
   MONGODB_URI=<your_mongo_db_uri>
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   ```

### Running the Project

Start the server in development mode:

```sh
npm run dev
```

The server will be running on `http://localhost:<your_port>`.

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/register`: Register a new user.
- **POST** `/api/v1/auth/login`: Log in an existing user.
- **GET** `/api/v1/auth/:userId/verify/:token`: Verify a user account.

### Users

- **GET** `/api/v1/users`: Get all users (Admin only).
- **GET** `/api/v1/users/:userId`: Get a specific user by ID.
- **PUT** `/api/v1/users/:userId`: Update user details (User/Admin).
- **DELETE** `/api/v1/users/:userId`: Delete a user account (User/Admin).
- **POST** `/api/v1/users/profilePhoto`: Upload a profile photo for the logged-in user.

### Products

- **GET** `/api/v1/products`: Get all products.
- **POST** `/api/v1/products`: Create a new product (Admin only).
- **GET** `/api/v1/products/:productId`: Get product details by ID.
- **PUT** `/api/v1/products/:productId`: Update a product (Admin only).
- **DELETE** `/api/v1/products/:productId`: Delete a product (Admin only).
- **POST** `/api/v1/products/:productId/uploadImage`: Upload an image for a product (Admin only).
- **POST** `/api/v1/products/:productId/uploadImages`: Upload multiple images for a product (Admin only).

### Categories

- **GET** `/api/v1/categories`: Get all categories.
- **POST** `/api/v1/categories`: Create a new category (Admin only).
- **GET** `/api/v1/categories/:categoryId`: Get category details by ID.
- **PUT** `/api/v1/categories/:categoryId`: Update a category (Admin only).
- **DELETE** `/api/v1/categories/:categoryId`: Delete a category (Admin only).
- **POST** `/api/v1/categories/:categoryId/updateImage`: Update the image of a category (Admin only).

### Orders

- **POST** `/api/v1/orders`: Create a new order (User only).
- **GET** `/api/v1/orders`: Get all orders (Admin only).
- **PUT** `/api/v1/orders/:orderId`: Update the status of an order (User/Admin).
- **DELETE** `/api/v1/orders/:orderId`: Delete an order (User/Admin).
- **GET** `/api/v1/orders/totalSales`: Get the total sales amount (Admin only).
- **GET** `/api/v1/orders/users/:userId`: Get orders of a specific user (Admin only).

### Project source

- *https://roadmap.sh/projects/ecommerce-api*
