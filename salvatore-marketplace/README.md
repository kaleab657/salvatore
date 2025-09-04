# Salvatore Marketplace

A full-stack buy-and-sell marketplace application for Ethiopia, built with React, Firebase, and TailwindCSS.

## Features

- 🏠 **Home Screen**: Featured ads with search and category filtering
- 🔍 **Search Screen**: Advanced search with filters and grid/list view
- 📝 **Post Ad Screen**: Dynamic form with category-specific fields
- 💬 **Messages Screen**: Real-time chat functionality
- 👤 **Profile Screen**: User management and statistics
- 📱 **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **UI Components**: Headless UI

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd salvatore-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password, Google)
   - Create Firestore database
   - Enable Storage
   - Update `src/firebase/config.ts` with your Firebase config

4. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Firebase Configuration

Update `src/firebase/config.ts` with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── firebase/           # Firebase configuration
├── types/              # TypeScript interfaces
├── data/               # Demo data
└── App.tsx            # Main app component
```

## Features Overview

### Authentication
- Email/Password sign up and sign in
- Google OAuth integration
- User profile management

### Ads Management
- Create, read, update, delete ads
- Image upload to Firebase Storage
- Category-specific dynamic fields
- Search and filtering

### Messaging
- Real-time chat using Firestore
- Message history
- User-to-user conversations

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.
