# Nel Ngabo - Official Artist Website

A modern, professional career website showcasing the music, videos, tours, and exclusive content of Nel Ngabo.

## 🎵 About Nel Ngabo

Nel Ngabo is a talented music artist dedicated to creating authentic and impactful music. This website serves as the central hub for fans to discover new releases, watch exclusive videos, stay updated on tour dates, and connect with the artist.

## ✨ Features

### 🎶 Music Section
- Complete discography with album covers and track listings
- Streaming platform links (Spotify, Apple Music, YouTube, SoundCloud)
- Latest releases prominently featured
- Easy navigation through music catalog

### 🎬 Videos
- Official music videos
- Behind-the-scenes content
- Live performances
- YouTube integration

### 🎤 Tours & Live Events
- Upcoming tour dates and venues
- Ticket purchase links
- Tour schedule and locations
- Event information

### 🎨 Modern Design
- Responsive design for all devices
- Smooth animations and transitions
- Professional video background
- Intuitive navigation

### 🔐 Admin Dashboard
- Content management system
- Easy updates for music, videos, and tours
- Image upload functionality
- Secure authentication

## 🛠️ Technology Stack

This website is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui & Radix UI
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **API Documentation**: Swagger/OpenAPI

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stark-sound-space
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory
   - Add your MongoDB connection string and other required variables

5. Start the development servers:

Frontend (runs on http://localhost:8080):
```bash
npm run dev
```

Backend (runs on http://localhost:4000):
```bash
cd backend
npm run dev
```

## 📁 Project Structure

```
stark-sound-space/
├── src/
│   ├── components/      # React components
│   │   ├── Hero.tsx     # Hero section with video background
│   │   ├── Sidebar.tsx  # Navigation sidebar
│   │   └── ...
│   ├── pages/           # Page components
│   ├── context/         # React Context providers
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
├── backend/
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Express server
│   └── package.json
└── public/              # Static assets
```

## 🔑 Admin Access

The website includes a secure admin dashboard for content management:

- **Login**: Access at `/admin/login`
- **Features**: 
  - Manage hero section content
  - Add/edit/delete albums and tracks
  - Manage video content
  - Update tour dates and ticket links
  - Update account credentials

## 🌐 API Documentation

API documentation is available at `/api/docs` when the backend server is running. The documentation includes:

- Hero settings endpoints
- Albums CRUD operations
- Videos management
- Tours management
- Authentication endpoints

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 Customization

All content can be managed through the admin dashboard:
- Artist name and branding
- Hero background video
- Social media links
- Streaming platform links
- Navigation menu items
- Album covers and track listings

## 🔒 Security

- Secure authentication for admin access
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization

## 📞 Contact & Social Media

- **Instagram**: [@nelngabo](https://www.instagram.com/nelngabo/)
- **Twitter/X**: [@nelngabo](https://twitter.com/nelngabo)
- **YouTube**: [Nel Ngabo](https://www.youtube.com/@nelngabo9740)
- **Facebook**: [Nel Ngabo](https://facebook.com/nelngabo)

## 📄 License

All content and music are the property of Nel Ngabo. Unauthorized use is prohibited.

## 🙏 Acknowledgments

Built with modern web technologies to provide the best experience for fans and visitors.

---

**© 2024 Nel Ngabo. All Rights Reserved.**
