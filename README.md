# Gym Dashboard

A modern React + Vite admin dashboard for managing a gym business efficiently. This application helps administrators monitor performance, manage members, trainers, and workout classes, and keep day-to-day operations organized from a single interface.

## Overview

The Gym Dashboard is designed for fitness centers and gym management teams that need a streamlined system for:

- tracking members and their membership status
- managing trainers and their specialties
- organizing workout classes and schedules
- monitoring gym performance through a dashboard overview
- protecting admin-only routes and authenticated access

## Features

- Responsive admin interface built with React and Vite
- Dashboard overview with key statistics such as active members, trainers, and total revenue
- Member management with add, view, edit, delete, and search capabilities
- Trainer management with search, status tracking, and CRUD actions
- Workout class management for adding and tracking class information
- Role-based protected routes for admin access only
- Secure authentication flow with token storage in local storage
- Modern UI styling using Tailwind CSS and component-based React architecture

## Tech Stack

- React 19
- Vite
- React Router DOM
- Zustand for state management
- Axios for API communication
- Tailwind CSS
- Recharts for analytics visuals
- Lucide React for icons
- ESLint for code quality

## Project Structure

```text
gym-dashboard/
├── public/
├── src/
│   ├── api/
│   │   └── axiosInstance.js
│   ├── components/
│   │   ├── AddMemberModal.jsx
│   │   ├── AddTrainerModal.jsx
│   │   ├── AddWorkoutClassModal.jsx
│   │   ├── DetailsMemberModal.jsx
│   │   ├── DetailsTrainerModal.jsx
│   │   ├── DetailsWorkoutClassModal.jsx
│   │   ├── EditMemberModal.jsx
│   │   ├── EditTrainerModal.jsx
│   │   └── EditWorkoutClassModal.jsx
│   ├── hooks/
│   │   └── useMembers.js
│   ├── layouts/
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── ClassesPage.jsx
│   │   ├── Login.jsx
│   │   ├── MembersPage.jsx
│   │   ├── TrainersPage.jsx
│   │   └── Unauthorized.jsx
│   ├── routes/
│   │   ├── index.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── services/
│   │   └── memberService.js
│   ├── store/
│   │   └── useAuthStore.js
│   ├── utils/
│   │   ├── decodeToken.js
│   │   └── membership.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vercel.json
├── vite.config.js
└── ...
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm or yarn
- A working backend API for gym data

## Installation

1. Clone the repository

```bash
git clone https://github.com/Ahmedtamerr505/Gym-Management.git
cd Gym-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env` file in the project root and add your API base URL:

```env
VITE_API_BASE_URL=http://localhost:7198
```

> The application uses this value as the base URL for all API calls. If the variable is not set, it falls back to `https://localhost:7198`.

## Running the Project

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, typically:

```text
http://localhost:5173
```

## Production Build

To generate a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev      # start the Vite development server
npm run build    # build for production
npm run preview  # locally preview the production build
npm run lint     # run ESLint checks
```

## API Integration

This frontend is designed to work with a backend API exposing endpoints such as:

- `/api/Auth/login`
- `/api/Members`
- `/api/Trainers`
- `/api/WorkoutClasses`
- `/api/Dashboard`

The client automatically attaches the stored auth token to requests when available.

## Authentication and Access Control

The app includes a protected route system:

- Public access to the login page
- Admin-only access to dashboard pages
- Unauthorized users are redirected to the unauthorized page
- Auth state is stored in local storage so sessions persist across reloads

## License

This project does not currently include a license file, so licensing details are not specified at this time.

## Contributing

Contributions are welcome. If you want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear description

## Contact

For questions or collaboration inquiries, please reach out through the project repository on GitHub.
