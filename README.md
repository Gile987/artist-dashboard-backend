# 🎵 Artist Dashboard Backend

A comprehensive backend API for music artists to manage their releases, tracks, and royalties. Built with modern technologies for scalability and security.

> **🖥️ Frontend Application**: The complete frontend for this backend is available at [music-dist](https://github.com/Gile987/music-dist)

## 🎯 What This App Does

The Artist Dashboard Backend is a RESTful API that provides:

- **User Management**: Artists and admins can register, login, and manage their profiles
- **Music Release Management**: Artists can upload and manage their albums/singles with metadata
- **Track Management**: Individual track handling with ISRC codes, file storage, and streaming analytics
- **Stream Analytics**: Track-level stream counts with automatic release total calculations
- **Royalty Management**: Publicly queryable royalties, but only admins can create, update, or delete royalty records
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
- **Prisma Middleware** - Custom middleware for automatic stream analytics calculations
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
├── streams (denormalized total from tracks)
├── artist (Many-to-One with User)
└── tracks[] (One-to-Many)

Track (Individual Songs)
├── id, title, duration, isrc, fileUrl
├── streams (individual track stream count)
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
- Automatic total streams calculation from associated tracks

### **Stream Analytics**

- **Track-Level Streams**: Each track maintains its own stream count with real-time updates
- **Release Total Streams**: Automatically calculated and stored as the sum of all track streams
- **Database-Level Automation**: Uses Prisma middleware to automatically recalculate release totals when:
  - Track streams are updated via API
  - New tracks are added to a release
  - Tracks are deleted from a release
- **Performance Optimized**: Uses denormalized storage for fast retrieval of release totals
- **Zero-Dependency Architecture**: No circular dependencies between services
- **Transparent Operations**: Stream recalculation happens automatically at the database level
- **API Integration Ready**: Stream data can be updated from external analytics services

### **Royalty Calculation**

- **Track-Level Royalties**: Each track now calculates its royalty based on the formula `streams * 0.01`. This ensures that royalties are directly proportional to the number of streams a track receives.
- **Release Total Royalties**: The total royalty for a release is automatically calculated as the sum of royalties for all tracks associated with the release.
- **Database-Level Automation**: Prisma middleware ensures that royalties are recalculated whenever:
  - A track's stream count is updated.
  - A new track is added to a release.
  - A track is deleted from a release.
- **Transparency**: These calculations happen automatically at the database level, requiring no additional API calls or manual intervention.

### **Example: Updating Track Streams**

```bash
PATCH /tracks/1
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "streams": 7500
}

# This automatically:
# 1. Updates the track's stream count in the database
# 2. Recalculates the track's royalty as `streams * 0.01`
# 3. Updates the release's total royalty to reflect the new track royalty
# 4. All happens transparently without additional API calls
```

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
├── prisma.service.ts  # Database connection + stream analytics middleware
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
- `GET /releases/artist/:artistId` - Get artist's releases (includes totalStreams)
- `GET /releases/:id` - Get release details (includes totalStreams calculated from tracks)
- `PATCH /releases/:id` - Update release (including status)
- `DELETE /releases/:id` - Delete release

### **Tracks**

- `POST /tracks` - Create new track (with optional streams count)
- `GET /tracks/release/:releaseId` - Get tracks for release (includes streams)
- `GET /tracks/:id` - Get specific track (includes streams)
- `PATCH /tracks/:id` - Update track (including streams - automatically updates release totals)
- `DELETE /tracks/:id` - Delete track (automatically updates release totals)

### **File Upload**

- `GET /upload/signed-url` - Get signed URL for file upload (artists only)

### **Royalties**

- `POST /royalties` - Create new royalty _(Admin Only)_
- `GET /royalties` - Get all royalties _(Public)_
- `GET /royalties/:id` - Get specific royalty _(Public)_
- `GET /royalties/artist/:artistId` - Get royalties for specific artist _(Public)_
- `GET /royalties/track/:trackId` - Get royalties for specific track _(Public)_
- `PATCH /royalties/:id` - Update royalty _(Admin Only)_
- `DELETE /royalties/:id` - Delete royalty _(Admin Only)_

## 🔄 API Usage Examples

### **Updating Track Streams (Auto-Updates Release Totals)**

```bash
PATCH /tracks/1
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "streams": 7500
}

# This automatically:
# 1. Updates the track's stream count in the database
# 2. Prisma middleware intercepts the operation
# 3. Automatically recalculates and updates release total streams
# 4. All happens transparently without additional API calls
```

### **Creating a Track with Streams**

```bash
POST /tracks
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "title": "My Amazing Song",
  "duration": 180,
  "releaseId": 1,
  "fileUrl": "https://your-bucket.r2.dev/track.mp3",
  "streams": 5000
}
```

### **Getting Release with Total Streams**

```bash
GET /releases/1
Authorization: Bearer <your-jwt-token>

# Response includes real-time calculated totals:
{
  "id": 1,
  "title": "My Album",
  "streams": 15000,        # Stored total (sum of all track streams)
  "totalStreams": 15000,   # Same value, included for API compatibility
  "tracks": [
    {
      "id": 1,
      "title": "Track 1",
      "streams": 5000
    },
    {
      "id": 2,
      "title": "Track 2",
      "streams": 10000
    }
  ]
}
```

## ⚡ Stream Analytics Architecture

### **Prisma Middleware Integration**

The system uses Prisma middleware to ensure release totals stay synchronized at the database level:

1. **Track Operation Initiated**: Any track create, update, or delete operation
2. **Prisma Middleware Intercepts**: Database operation is intercepted by custom middleware
3. **Track Operation Completes**: Original track operation executes normally
4. **Automatic Recalculation**: Middleware automatically recalculates release total streams
5. **Denormalized Storage**: Updated total is stored in the release record for fast retrieval

### **Benefits**

- **Zero Dependencies**: No circular dependencies between services
- **Database-Level Consistency**: Impossible to have mismatched stream totals
- **Performance**: No need to calculate totals on every release fetch
- **Transparent**: Works with any track operation without code changes
- **Error Resilient**: Recalculation failures don't break main operations
- **Future-Proof**: Automatically handles direct database operations and migrations

## �🔧 Setup & Installation

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
