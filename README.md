# Eye Sigil Generator

An AI-powered web application that uses machine learning for precise facial landmark detection to overlay customizable sigils onto eyes in photographs. Built with modern web technologies and developed entirely using AI assistance.

![Eye Sigil Generator Preview](preview.png)

## 🚀 Try It Out

Visit the live application: [Eye Sigil Generator](https://anime-eyes.replit.app/)

## ✨ Features

- Real-time facial landmark detection using MediaPipe Face Mesh
- Precise eye center detection using landmarks 468/473
- Client-side ML processing for privacy and performance
- Customizable sigil overlays with transform controls
- Drag-and-drop interface
- Real-time preview system

## 🛠️ Technical Stack

### Frontend
- React 18.3 with TypeScript
- Vite build system
- TailwindCSS + shadcn/ui components
- React Query for state management

### Backend
- Express.js with TypeScript
- PostgreSQL + Drizzle ORM
- RESTful API architecture
- JWT authentication

## 🔒 Privacy & Performance

All image processing and face detection happens client-side. Your photos never leave your browser, ensuring complete privacy.

## 🤖 Development Process

This project was developed using:
- Replit's development environment
- AI assistance from Replit AI and Claude

## 📝 License

This project is available under the Apache License. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- MediaPipe Face Mesh (Apache 2.0 License) - Google's remarkable ML model providing the core face detection capabilities
- remove.bg - For their excellent background removal service that helps users create custom sigils
- shadcn/ui (MIT License) - Beautiful, accessible React components that form our user interface
- React (MIT License) - The foundation of our modern, responsive application

## 🔗 Links

- [Live Demo](https://anime-eyes.replit.app/)
