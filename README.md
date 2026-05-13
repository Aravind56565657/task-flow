# TaskFlow Pro

TaskFlow Pro is a premium modern SaaS project management platform built with React, Vite, Tailwind CSS, and Firebase.

## Features

- **Secure Authentication**: Email/Password and Google Login powered by Firebase Auth.
- **Real-time Dashboard**: Live analytics and productivity tracking using Recharts and Firestore listeners.
- **Project & Task Management**: Full CRUD operations for projects and tasks with status and priority tracking.
- **Modern UI**: Polished startup-style interface with smooth animations, dark/light ready, and glassmorphism.
- **Role-Based Access**: Secure data access controlled by robust Firestore Security Rules.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Data Viz**: Recharts
- **Icons**: Lucide React

## Setup & Deployment

### Environment Variables
The application uses Firebase configuration from `firebase-applet-config.json`. For manual setup, ensure your `.env` contains:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
...
```

### Local Development
```bash
npm install
npm run dev
```

### Deployment (e.g., Vercel / Netlify)
1. Link your repository.
2. Ensure build command is `npm run build` and output directory is `dist`.
3. Add your Firebase environment variables to the platform's settings.

## Firestore Security Rules
Rules are located in `firestore.rules`. They enforce that users can only access their own projects and associated tasks.

## License
Apache-2.0
