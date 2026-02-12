# Deluxe Llama

Deluxe Llama is a modern web application built with Next.js, leveraging the power of pnpm for efficient package management. This project showcases a cutting-edge tech stack with React, TypeScript, Tailwind CSS, and Zustand for state management.

## 🚀 Features

- **Next.js 16** - Latest version with App Router
- **React 19** - Latest React features and improvements
- **pnpm** - Fast, disk space efficient package manager
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Framer Motion** - Production-ready motion library
- **React Hook Form** - Performant form library with easy validation
- **Zod** - TypeScript-first schema validation
- **Immer** - Immutable state management
- **nanoid** - Secure URL-friendly unique string ID generator

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Package Manager**: pnpm
- **Linting**: ESLint

## 📦 Installation

### Prerequisites

Make sure you have Node.js installed (v18 or higher recommended).

### Using pnpm (Recommended)

1. Install pnpm globally (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. Install project dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

### Alternative Package Managers

While pnpm is the recommended package manager for this project, you can also use:

#### Using npm:
```bash
npm install
npm run dev
```

#### Using Yarn:
```bash
yarn install
yarn dev
```

#### Using Bun:
```bash
bun install
bun dev
```

## 🚀 Development Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code issues

## 🏗️ Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── globals.css         # Global styles
└── ...                 # Other route handlers and components
public/                 # Static assets
styles/                 # Additional stylesheets
types/                  # TypeScript type definitions
```

## 📝 Key Dependencies

- **@hookform/resolvers**: Integration between React Hook Form and validation libraries
- **clsx**: Utility for conditionally joining CSS class names
- **framer-motion**: Production-ready motion library for React
- **immer**: Create the next immutable state by mutating the current one
- **nanoid**: A tiny, secure, URL-friendly, unique string ID generator
- **react-hook-form**: Performant, flexible forms with easy validation
- **tailwind-merge**: Utility for merging Tailwind CSS classes
- **zod**: TypeScript-first schema declaration and validation library
- **zustand**: Bear necessities for state management in React

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Performance Benefits of pnpm

This project uses pnpm for package management, which offers several advantages:

- **Disk Space Efficiency**: Hard links and symlinks mean packages are stored once on your disk, regardless of how many projects use them
- **Speed**: Fast installation and updates due to the optimized algorithm
- **Strictness**: Prevents phantom dependencies and encourages well-defined dependency trees
- **Monorepo Ready**: Excellent support for monorepos if the project scales

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [pnpm Documentation](https://pnpm.io/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.