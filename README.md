Markdown
# User Management Dashboard (React + Tailwind CSS v4)

A clean, responsive, and functional single-page web application built with **React** and **Tailwind CSS v4**. This dashboard connects to a mock backend API to view, add, edit, and delete user details with dynamic frontend state management.

---

## 🚀 Features

- **Full CRUD Simulation**: 
  - **View**: Fetches and renders mock users instantly from JSONPlaceholder.
  - **Add**: Creates new users dynamically and adds them to the list (simulated POST).
  - **Edit**: Pre-fills the form with existing metadata and updates the state on save (simulated PUT).
  - **Delete**: Safely eliminates profiles with a verification prompt (simulated DELETE).
- **Advanced Filter Popup**: An absolute overlay menu allowing users to filter by specific fields (First Name, Last Name, Email, and Department).
- **Global Search**: Real-time matching across names, emails, and departments.
- **Dynamic Sorting**: Toggle list ordering by ID (Low to High / High to Low) or Full Name (A-Z / Z-A).
- **Pagination Matrix**: Flexible limits (`10`, `25`, `50`, `100` records per page) with reactive navigation controls.
- **Tailwind CSS v4 & Responsive Grid**: Designed from scratch using fluid typography and component mechanics that adjust natively to mobile, tablet, and desktop views.
- **Graceful Error Handling**: Features state-aware skeletons (shimmer loaders) and toast notification layouts for operational feedback.

---

## 📁 Project Structure

```text
user-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── FilterPopup.jsx      # Advanced filtering overlay menu
│   │   └── UserModal.jsx        # Multi-mode Form Modal for Add/Edit
│   ├── App.jsx                  # Main State Machine & Table View Controller
│   ├── index.css                # Base stylesheet importing Tailwind v4
│   └── main.jsx                 # Application DOM entrypoint
├── index.html                   # Core HTML template
├── package.json                 # Project dependencies & operational scripts
└── vite.config.js               # Vite configurations utilizing @tailwindcss/vite plugin
🛠️ Prerequisites & Installation
Make sure you have Node.js installed on your machine.

1. Clone or Extract the Project
Navigate into your project directory:

Bash
cd user-dashboard
2. Install Project Dependencies
Run Vite's default installation command to fetch all essential node modules:

Bash
npm install
3. Install Tailwind CSS v4 Ecosystem
Ensure the specific Tailwind v4 packages and Vite compilation plugins are loaded:

Bash
npm install tailwindcss @tailwindcss/vite
⚙️ Configuration Setup
Verify that your local configurations match the following settings for smooth execution:

Vite Configuration (vite.config.js)
JavaScript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Initializes Tailwind v4 compiler
  ],
})
CSS Entry Point (src/index.css)
CSS
@import "tailwindcss";
🖥️ Running the Application
To execute the project in development mode, run the following command in your terminal:

Bash
npm run dev
Once the local server triggers, open the provided URL (usually http://localhost:5173) in your preferred web browser.

🌐 API Reference
This application communicates with:

Base Endpoint: https://jsonplaceholder.typicode.com/users

Behavior Note: Since JSONPlaceholder is a static mock API, data mutations (POST, PUT, DELETE) return a successful 200/201 status code response but do not persistently modify the remote server's database. The app handles these side effects on the client state to simulate a persistent database workflow.


  Author Shubham Divyanshu
