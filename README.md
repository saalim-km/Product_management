# MERN Stack Application - Interview Assignment

A full-stack web application built with modern technologies, featuring clean architecture, scalable design, and efficient image handling with cloud storage.

## 🏢 Company Information

**SECLOB TECHNOLOGIES**  
3rd Floor, Sahya Building  
Govt. Cyberpark, Palazhi,  
Kozhikode, Kerala 673016  

📧 hr@seclob.in  
🌐 www.seclobtechnologies.in  

## 🎨 Design Reference

[Figma Design](https://www.figma.com/design/VQJvtPqJIM6rFcHa7qa4Ii/Demo?node-id=0-1&node-type=canvas&t=EuT1cf0QBbyqEjFw-0)

## 🚀 Tech Stack

### Frontend
- **React** - Modern UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **CSS3/SCSS** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **TypeScript** - Type-safe server-side development
- **Clean Architecture** - Scalable and maintainable code structure
- **Separation of Concerns** - Modular design principles

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database

### Cloud Services
- **AWS S3** - Cloud storage for images with presigned URLs
- **Redis** - Caching layer for presigned URLs optimization

## 🏗️ Architecture Overview

This application follows **Clean Architecture** principles with clear separation of concerns:

\`\`\`
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── application/
│   │   ├── usecases/
│   │   ├── interfaceAdapters/
│   │   ├── presentation/
│   │   ├── shared/
│   └── tests/
└── docs/
\`\`\`

### Key Architectural Features

- **Layered Architecture**: Clear separation between presentation, business logic, and data layers
- **Dependency Injection**: Loose coupling between components
- **Repository Pattern**: Abstracted data access layer
- **Service Layer**: Business logic encapsulation
- **Caching Strategy**: Redis implementation for optimized performance

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- AWS S3 bucket
- Redis instance

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Backend `.env`
\`\`\`env
# Server Configuration
PORT=3002
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# Redis
REDIS_URL=your_redis_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:5173
\`\`\`

#### Frontend `.env`
\`\`\`env
REACT_APP_API_URL=http://localhost:3002/api/v_1
REACT_APP_ENVIRONMENT=development
\`\`\`

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd <project-name>
   \`\`\`

2. **Install Backend Dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Install Frontend Dependencies**
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

4. **Setup Environment Variables**
   - Copy the environment variables as shown above
   - Replace placeholder values with your actual credentials

5. **Start the Application**

   **Backend (Terminal 1):**
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

   **Frontend (Terminal 2):**
   \`\`\`bash
   cd frontend
   npm start
   \`\`\`

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `tsx watch src/index.ts` - Start production server

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

## 📡 API Endpoints

### Authentication
- `POST /api/v_1/auth/register` - User registration
- `POST /api/v_1/auth/login` - User login

### Image Management
- `POST /api/images/upload` - Get presigned URL for image upload
- `GET /api/images` - Get all images
- `GET /api/images/:id` - Get specific image
- `DELETE /api/images/:id` - Delete image

## 🎯 Key Features

### Image Upload System
- **Presigned URLs**: Secure, direct-to-S3 uploads
- **Redis Caching**: Cached presigned URLs to prevent regeneration
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management

### Performance Optimizations
- **Caching Layer**: Redis for frequently accessed data (eg : Presigned url from S3)

### Security Features
- **JWT Authentication**: Secure user sessions
- **Input Validation**: Server-side validation
- **CORS Configuration**: Proper cross-origin setup
- **Environment Variables**: Secure credential management

## 🧪 Testing

\`\`\`bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run tests with coverage
npm run test:coverage
\`\`\`

## 📦 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### Commit Message Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or updates

## 📝 Project Structure Details

### Clean Architecture Implementation

The backend follows clean architecture principles:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access
- **Models**: Define data structures
- **Middleware**: Handle cross-cutting concerns

### TypeScript Integration

- Strict type checking enabled
- Custom type definitions for all entities
- Interface-based development
- Generic implementations for reusability

## 🔍 Monitoring & Logging

- Request/Response logging
- Error tracking and reporting
- Performance monitoring
- Redis cache hit/miss metrics

## 📄 License

This project is created as part of an interview assignment for SECLOB TECHNOLOGIES.

## 📞 Contact

For any questions or clarifications regarding this assignment:

**Salim K M**  
📧 saalimkm@gmail.com  
🌐 [www.salimkm.tech ](https://salimkm.tech/) 
📍 Kochi, Kerala

---

**Note**: This application was developed as part of a technical interview process, demonstrating proficiency in MERN stack development with modern architectural patterns and cloud integration.
\`\`\`

This README.md file provides a comprehensive overview of your project with professional formatting, clear structure, and all the technical details you mentioned. It includes sections for setup, architecture, API documentation, and follows GitHub best practices for documentation.
