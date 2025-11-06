# Explorer

A modern web application built with React, TypeScript, and shadcn/ui components.

## 🚀 Features

- ⚡️ Built with Vite for fast development
- 🎨 Styled with Tailwind CSS
- 🧩 shadcn/ui components for beautiful UI
- 🌐 React Three Fiber for 3D graphics
- 🔐 Node.js backend with MongoDB database
- 📱 Fully responsive design
- 🛠 TypeScript for type safety

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **3D Graphics**: React Three Fiber
- **State Management**: React Query
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Prerequisites

- Node.js 16+ (LTS recommended)
- pnpm (recommended) or npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd explorer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your API URL:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Set up the backend**
   ```bash
   cd server
   npm install
   # Create a .env file with MongoDB connection string
   echo "MONGODB_URI=mongodb://localhost:27017/explorer" > .env
   echo "PORT=3001" >> .env
   # Seed the database
   node seed.js
   # Start the backend server
   npm run dev
   ```

5. **Start the frontend development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173`

## 🏗 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build locally
- `lint` - Run ESLint

## 📂 Project Structure

```
.
├── public/          # Static files
├── server/          # Backend server
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   └── server.js    # Server entry point
├── src/             # Source files
│   ├── assets/      # Images, fonts, etc.
│   ├── components/  # Reusable components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── pages/       # Page components
│   └── styles/      # Global styles
├── .gitignore
├── package.json
├── README.md
└── vite.config.ts   # Vite configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Vite](https://vitejs.dev/) for the build tool
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Three Fiber](https://docs.pmnd.rs/) for 3D graphics
