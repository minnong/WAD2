# WAD2 Project

A web application built with React, TypeScript, Vite, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

You can verify your installations by running:
```bash
node --version
npm --version
```

## Setup Instructions

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd wad2-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Project

### Development Mode

To start the development server with hot reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

To build the project for production:

```bash
npm run build
```

The built files will be generated in the `dist` folder.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run ESLint and check for code quality issues:

```bash
npm run lint
```

## Project Structure

```
wad2-project/
├── public/          # Static assets
├── src/             # Source code
│   ├── assets/      # Images, icons, etc.
│   ├── App.tsx      # Main App component
│   ├── App.css      # App-specific styles
│   ├── main.tsx     # Application entry point
│   └── vite-env.d.ts # Vite type definitions
├── index.html       # HTML template
├── package.json     # Project dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
├── vite.config.ts   # Vite configuration
└── tsconfig.json    # TypeScript configuration
```

## Technology Stack

- **React** - Frontend library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run `npm run lint` to check for issues
4. Test your changes with `npm run dev`
5. Build the project with `npm run build` to ensure it compiles
6. Submit a pull request
