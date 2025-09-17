# Product Management Application

A modern full-stack web application for individuals to efficiently manage their products with secure image handling and real-time data management.

## Features

- **Product Management**: Create, read, update, and delete products
- **Image Upload**: Secure direct-to-S3 uploads using presigned URLs
- **User Authentication**: JWT-based secure authentication system
- **Performance Optimization**: Redis caching for improved response times
- **Clean Architecture**: Modular design with separation of concerns
- **Real-time Updates**: Instant product data synchronization

## Tech Stack

### Frontend
- React with TypeScript
- CSS3/SCSS for styling
- Responsive design

### Backend
- Node.js with Express
- TypeScript
- Clean Architecture principles
- Repository pattern implementation

### Database & Storage
- MongoDB for data persistence
- AWS S3 for image storage
- Redis for caching

### Security
- JWT authentication
- Bcrypt password hashing
- Input validation
- CORS protection

## Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- MongoDB Atlas account
- AWS S3 bucket
- Redis instance

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd product-management-app
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Install frontend dependencies**
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

4. **Environment Configuration**

   Create `backend/.env`:
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

   Create `frontend/.env`:
   \`\`\`env
   REACT_APP_API_URL=http://localhost:3002/api/v_1
   REACT_APP_ENVIRONMENT=development
   \`\`\`

5. **Start the application**
   \`\`\`bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   \`\`\`

## API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v_1/auth/register` | User registration | No |
| `POST` | `/api/v_1/auth/login` | User login | No |

### Product Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v_1/product` | Create product & get presigned URL | Yes |
| `GET` | `/api/v_1/product` | Get all products | Yes |
| `PUT` | `/api/v_1/product/:id` | Update product | Yes |
| `DELETE` | `/api/v_1/product/:id` | Delete product | Yes |

## Usage

1. **Register/Login**: Create an account or login to access the application
2. **Add Products**: Create new products with images and details
3. **Manage Products**: View, edit, or delete existing products
4. **Image Upload**: Upload product images directly to AWS S3
5. **Search & Filter**: Find products quickly with built-in search functionality

## Architecture

The application follows clean architecture principles:

- **Presentation Layer**: React components and UI logic
- **Service Layer**: Business logic and API calls
- **Repository Layer**: Data access abstraction
- **Infrastructure Layer**: External services (AWS S3, Redis, MongoDB)

### Key Design Patterns
- Repository Pattern for data access
- Dependency Injection for loose coupling
- Service Layer for business logic
- Caching Strategy with Redis

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm test` - Run test suite
- `npm start` - Start production server

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful commit messages
- Write unit tests for new features

## Deployment

### Production Build
1. **Backend**: Run `npm run build` and deploy the `dist` folder
2. **Frontend**: Run `npm run build` and deploy the `build` folder
3. **Environment**: Set production environment variables
4. **Database**: Ensure MongoDB Atlas is configured for production

### Recommended Platforms
- **Backend**: Railway, Heroku, AWS EC2
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud, AWS ElastiCache

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Adding tests

## Testing

Run the test suite to ensure everything works correctly:

\`\`\`bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
\`\`\`

## Performance

- **API Response Time**: < 200ms average
- **Image Upload**: Direct-to-S3 for optimal speed
- **Caching**: Redis implementation for frequently accessed data
- **Database**: Optimized MongoDB queries with indexing

## Security

- JWT tokens for authentication
- Bcrypt for password hashing
- Input validation on all endpoints
- CORS configuration
- Presigned URLs for secure S3 uploads
- Environment variable protection

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure your IP is whitelisted in MongoDB Atlas
2. **AWS S3 Access**: Verify AWS credentials and bucket permissions
3. **Redis Connection**: Check Redis URL and connection status
4. **CORS Errors**: Ensure frontend URL is configured in backend environment

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

\`\`\`
MIT License

Copyright (c) 2024 Product Management Application

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

## Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Built with modern web technologies for efficient product management.**
