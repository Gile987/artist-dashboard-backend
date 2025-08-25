# 🎵 Artist Dashboard Backend

A comprehensive backend API for music artists to manage their releases, tracks, and royalties. Built with modern technologies for scalability and security.

## 🎯 What This App Does

The Artist Dashboard Backend is a RESTful API that provides:

- **User Management**: Artists and admins can register, login, and manage their profiles
- **Music Release Management**: Artists can upload and manage their albums/singles with metadata
- **Track Management**: Individual track handling with ISRC codes and file storage
- **Royalty Management**: Admin-only system for tracking and managing artist royalties
- **File Upload System**: Secure file uploads to Cloudflare R2 for audio files and cover art
- **Role-Based Access Control**: Different permissions for artists and administrators
- **Release Status Management**: Approval workflow for music releases (PENDING/APPROVED/REJECTED)

## 🛠️ Technologies Used

### **Core Framework**

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework for building scalable server-side applications
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript with enhanced developer experience
- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment

### **Database & ORM**

- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Prisma](https://www.prisma.io/)** - Modern database toolkit and ORM
- **Database Migrations** - Version-controlled schema changes

### **Authentication & Security**

- **[JWT (JSON Web Tokens)](https://jwt.io/)** - Stateless authentication
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing and salting
- **Cookie-based Authentication** - Secure HTTP-only cookies
- **Role-Based Access Control** - Artist and admin permission levels

### **File Storage**

- **[Cloudflare R2](https://www.cloudflare.com/products/r2/)** - S3-compatible object storage
- **[AWS SDK](https://aws.amazon.com/sdk-for-javascript/)** - S3 client for file operations
- **Signed URLs** - Secure, temporary upload URLs

### **Validation & Data**

- **[class-validator](https://github.com/typestack/class-validator)** - Decorator-based validation
- **[class-transformer](https://github.com/typestack/class-transformer)** - Object transformation
- **DTOs (Data Transfer Objects)** - Input validation and type safety

### **Development Tools**

- **[ESLint](https://eslint.org/)** - Code linting and style enforcement
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Jest](https://jestjs.io/)** - Testing framework
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TypeScript-specific linting

### **Additional Dependencies**

- **[Passport.js](http://www.passportjs.org/)** - Authentication middleware
- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)** - Cookie parsing middleware
- **[RxJS](https://rxjs.dev/)** - Reactive programming library

## 📊 Database Schema

```
User (Artists & Admins)
├── id, email, password, name, role
├── releases[] (One-to-Many)
└── royalties[] (One-to-Many) *

Release (Albums/Singles)
├── id, title, releaseDate, coverUrl, audioUrl
├── status (PENDING/APPROVED/REJECTED)
├── artist (Many-to-One with User)
└── tracks[] (One-to-Many)

Track (Individual Songs)
├── id, title, duration, isrc, fileUrl
├── release (Many-to-One with Release)
└── royalties[] (One-to-Many)

Royalty (Revenue Tracking)
├── id, amount, period
├── track (Many-to-One with Track)
└── artist (Many-to-One with User)
```

## 🚀 Key Features

### **Authentication System**

- User registration and login
- JWT-based stateless authentication
- Cookie-based session management
- Password hashing with bcrypt

### **File Upload Workflow**

1. Client requests signed upload URL
2. Direct upload to Cloudflare R2
3. URL stored in database for retrieval

### **Role-Based Access**

- **Artists**: Can request signed URLs for file uploads to Cloudflare R2
- **All Authenticated Users**: Can manage releases, tracks, and user profiles
- **Admins**: Exclusive access to royalty management system and user deletion
- **Role System**: Framework supports artist/admin roles with enforced permissions

### **Release Management**

- Create releases with metadata
- Upload cover art and audio files
- Track approval status
- Associate multiple tracks per release

### **Data Validation**

- Input validation using decorators
- Type safety with TypeScript
- Structured error responses

## 🏗️ Project Structure

```
src/
├── auth/           # Authentication (login, register, JWT)
├── user/           # User management (CRUD operations)
├── release/        # Music release management
├── track/          # Individual track handling
├── file-upload/    # Cloudflare R2 file operations
├── guards/         # Security guards (JWT, roles)
├── prisma.service.ts  # Database connection
└── main.ts         # Application bootstrap

prisma/
├── schema.prisma   # Database schema definition
└── migrations/     # Database migration history
```

## 📡 API Endpoints Overview

### **Authentication**

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

### **Users**

- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user _(Admin Only)_

### **Releases**

- `POST /releases` - Create new release
- `GET /releases/artist/:artistId` - Get artist's releases
- `PATCH /releases/:id` - Update release (including status)
- `DELETE /releases/:id` - Delete release

### **Tracks**

- `POST /tracks` - Create new track
- `GET /tracks/release/:releaseId` - Get tracks for release
- `GET /tracks/:id` - Get specific track
- `PATCH /tracks/:id` - Update track
- `DELETE /tracks/:id` - Delete track

### **File Upload**

- `GET /upload/signed-url` - Get signed URL for file upload (artists only)

### **Royalties** _(Admin Only)_

- `POST /royalties` - Create new royalty
- `GET /royalties` - Get all royalties
- `GET /royalties/:id` - Get specific royalty
- `GET /royalties/artist/:artistId` - Get royalties for specific artist
- `GET /royalties/track/:trackId` - Get royalties for specific track
- `PATCH /royalties/:id` - Update royalty
- `DELETE /royalties/:id` - Delete royalty

## 🔧 Setup & Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

## 🌐 Environment Configuration

```env
DATABASE_URL=postgresql://...
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET=your_bucket_name
JWT_SECRET=your_jwt_secret
```

## 📈 Development Workflow

- **Development**: `npm run start:dev` (watch mode)
- **Production**: `npm run start:prod`
- **Testing**: `npm run test`
- **Linting**: `npm run lint`
- **Database**: `npx prisma studio` (database GUI)

This backend serves as the foundation for a complete music distribution platform, handling everything from user authentication to file storage and royalty tracking.
