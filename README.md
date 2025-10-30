# Synergize - Task Management Platform

<div align="center">
  <p align="center">
    A sleek and intuitive project management platform designed to bring clarity and efficiency to your team's workflow.
    <br />
    <br />
    <!-- You can add a link to your live app here later -->
    <!-- <a href="#"><strong>View Demo »</strong></a>
    · -->
    <a href="https://github.com/sprakiles/Synergize/issues">Report Bug</a>
    ·
    <a href="https://github.com/sprakiles/Synergize/issues">Request Feature</a>
  </p>
</div>

---

## About The Project

Synergize is a full-stack web application that helps teams and individuals organize their tasks, track progress, and achieve their goals efficiently. Featuring a clean, interactive user interface, the app provides the necessary tools to visualize workflows and collaborate effectively.

---

## ✨ Key Features

*   **🔐 Secure User Authentication:** JWT-based registration and login system.
*   **📋 Interactive Kanban Boards:** Visualize your workflow with drag-and-drop task management.
*   **📂 Full Project Management:** Create, update, and delete projects with ease.
*   **📝 Detailed Task Management:** Add tasks with status (`To Do`, `In Progress`, `Done`), priority, and due dates.
*   **🌙 Modern UI/UX:** Features a responsive design with a seamless dark/light mode toggle.
*   **⚙️ User Profile Settings:** Users can update their profile information and change their password.

---

## 🛠️ Built With

This project is built with modern technologies to ensure high performance and a great user experience.

| Frontend (Client)      | Backend (Server)      | Database & DevOps            |
| ---------------------- | --------------------- | ---------------------------- |
| React.js               | Node.js               | PostgreSQL                   |
| Vite                   | Express.js            | Prisma ORM                   |
| Tailwind CSS           | JWT Authentication    | Vercel (Frontend Hosting)    |
| @dnd-kit (Drag & Drop) | Bcrypt.js             | Railway (Backend Hosting)     |
| @floating-ui/react     |                       | Concurrently (Dev Utility)   |

---

## 🚀 Getting Started

Follow these steps to set up a local development environment.

### Prerequisites

*   Node.js (v18 or later)
*   npm
*   Git
*   A running instance of PostgreSQL.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/sprakiles/Synergize.git
    cd Synergize
    ```

2.  **Install all dependencies for both client and server:**
    ```sh
    npm run install-all
    ```

3.  **Set up server environment variables:**
    *   Navigate to the `server` directory.
    *   Create a new file named `.env`.
    *   Add the following variables, replacing the placeholder values:
        ```env
        # Connection URL for your PostgreSQL database
        DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"

        # A strong, random secret key for signing JWTs
        JWT_SECRET="YOUR_SUPER_SECRET_KEY"
        ```

4.  **Apply database migrations:**
    Make sure you are inside the `server` directory, then run the Prisma command to set up your database schema.
    ```sh
    cd server
    npx prisma migrate dev
    ```

### Running the Application

Return to the root directory and run the following command to start both the client and server concurrently:

```sh
npm run dev
```

*   The frontend will be available at `http://localhost:5173`
*   The backend server will be running on `http://localhost:5000`

---

## 🌐 Deployment

This project is configured for a split deployment strategy:
*   **Frontend (Client):** Deployed on **Vercel**, with the Root Directory set to `client`.
*   **Backend (Server):** Deployed on **Render** as a Web Service, with the Root Directory set to `server`.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Project Link: [https://github.com/sprakiles/Synergize](https://github.com/sprakiles/Synergize)
Website Link: [https://synergize-theta.vercel.app](https://synergize-theta.vercel.app)
