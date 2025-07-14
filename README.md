# Chapa Frontend Developer Interview Assignment

This project is a role-based dashboard SPA built for a fictional Payment Service Provider, created as a solution to the Chapa Frontend Developer (React) Test Task. The application is built with Next.js and TypeScript, and it demonstrates a clean, component-based architecture with global state management and simulated API interactions.

[![Deploy with Vercel](https://vercel.com/button)](https://chapa-frontend-interview-assign-kidus1343.vercel.app/)

**Live Demo:** [https://chapa-frontend-interview-assignment-five.vercel.app/](https://chapa-frontend-interview-assignment-five.vercel.app/) 

## Screenshots
<img width="1745" height="939" alt="image" src="https://github.com/user-attachments/assets/b17de3c6-e666-4c1b-bf2f-ff00f8a3c5e2" />
<img width="1292" height="1049" alt="image" src="https://github.com/user-attachments/assets/ff074dde-33d5-4824-9bb8-8e8ad48dba5f" />
<img width="1330" height="971" alt="image" src="https://github.com/user-attachments/assets/2977a697-2e07-4461-8512-abfd03bf9949" />
<img width="1639" height="1060" alt="image" src="https://github.com/user-attachments/assets/96a84f09-2c67-4faf-b298-34cde7b2c66f" />


## Features

The application simulates three distinct user roles, each with a unique dashboard and set of permissions.

### 👤 User Dashboard
- **Wallet Balance:** View a real-time (mocked) wallet balance.
- **Transaction History:** See a list of recent credit and debit transactions.
- **Send Money:** Initiate a new transaction via a form, with validation for insufficient balance.
- **Confirmation Dialogs:** All critical actions (like sending money) require user confirmation for safety.

### 🛡️ Admin Dashboard
- **User Management:** View a filterable and searchable list of all platform users.
- **Activate/Deactivate Users:** Toggle the active status of any user with a confirmation step.
- **Dashboard Analytics:** View key metrics like Total Users, Active Users, and the combined Total Wallet Balance of all users.

### 👑 Super Admin Dashboard
- **Includes All Admin Features.**
- **Admin Management:** Add new admin accounts or remove existing ones securely.
- **System-Wide Statistics:** View high-level platform analytics, including Total Payments, Total Transactions, and Total Platform Revenue.
- **Segregated Views:** Combines the Admin User Management panel and Super Admin privileges into a single, powerful dashboard.

### General Features
- **Responsive Design:** The UI is fully responsive and provides a seamless experience on both desktop and mobile devices.
- **Simulated Authentication:** A secure login flow that directs users to the appropriate dashboard based on their role.
- **State Management:** Uses React's Context API (`AuthContext`) to manage global user state and authentication status across the application.
- **Toast Notifications:** Provides non-intrusive feedback for actions like successful transactions or errors.
- **Simulated API Service:** All backend interactions are mocked using a dedicated API service layer (`src/services/api.ts`) with `setTimeout` to simulate network latency.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) (with Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/) - A collection of beautifully designed components built with Radix UI and Tailwind CSS.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Linting & Formatting:** ESLint
- **Deployment:** [Vercel](https://vercel.com/)

## Project Structure

The project follows a clean, feature-oriented structure to ensure scalability and maintainability.

 ```bash
/
├── src/
│ ├── app/ # Core Next.js routing, layout, and global styles
│ ├── components/
│ │ ├── ui/ # Unmodified Shadcn UI components
│ │ ├── dashboards/ # Role-specific dashboard components
│ │ ├── Header.tsx # Global header component
│ │ └── Login.tsx # Login page component
│ ├── contexts/
│ │ └── AuthContext.tsx # Global state management for authentication
│ ├── hooks/
│ │ └── use-toast.ts # Custom hook for notifications
│ ├── services/
│ │ ├── api.ts # Centralized mock API service
│ │ └── mockData.ts # Mock data for users and transactions
│ └── types/
│ └── index.ts # TypeScript type definitions
├── package.json
└── tailwind.config.ts
```

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Kidus1343/Chapa-frontend-interview-assignment.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Chapa-frontend-interview-assignment
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo Accounts

You can use the following credentials to log in and test the different roles:

| Role          | Email                  | Password      |
|---------------|------------------------|---------------|
| **User**      | `user@chapa.co`        | `password123` |
| **Admin**     | `admin@chapa.co`       | `password123` |
| **Super Admin** | `superadmin@chapa.co`  | `password123` |
