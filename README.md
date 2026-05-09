# Real-time Monolithic Chat Application

A complete real-time chat application built with a monolithic architecture using React (Vite) for the frontend and Express/Node.js with Socket.io for the backend.

## Features

- **Monolithic Architecture**: Frontend and backend integrated into a single repository for easy development and deployment.
- **Real-time Messaging**: Powered by Socket.io for instant message delivery without refreshing.
- **Secure Authentication**: JWT-based login and registration system, with password hashing.
- **Sleek Dark Mode Design**: A premium, responsive user interface built with Vanilla CSS.
- **Auto-Seeding**: The application automatically provisions a "General" room when the database is first connected.

## Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB (running locally or a MongoDB Atlas URI)

## Setup & Installation

1. **Clone or Download the Repository**

2. **Install Root Dependencies**
   Navigate to the root directory and install the necessary backend and development dependencies (which includes `concurrently` for running both servers):
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   Navigate to the `client` directory and install the frontend dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   The application uses a `.env` file at the root for configuration. If your MongoDB is running locally on the default port, it should work out of the box. 

   Root `.env` example:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=yoursecretkey123
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

## Running the Application

### Development Mode

To start both the backend Express server and the Vite React frontend simultaneously with live reloading, run the following command from the root directory:

```bash
npm run dev
```

This will run:
- Backend API & Socket Server on `http://localhost:5001`
- Frontend React App on `http://localhost:5173` (proxied to the backend automatically)

Open **[http://localhost:5173](http://localhost:5173)** in your browser. Open it in two different browsers or windows to test real-time chat between different users!

### Production Mode

To build the React application and serve everything from the single Node.js backend:

1. Build the frontend:
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. Start the production server:
   ```bash
   npm start
   ```
   
The app will now be available on `http://localhost:5001`.

## Tech Stack

- **Frontend**: React, Vite, React Router, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Styling**: Vanilla CSS with CSS Variables
