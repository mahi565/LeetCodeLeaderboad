# LeetCode Stats Tracker

A full-stack application for tracking and comparing LeetCode statistics with friends and competitors.

## Features

- **User Authentication**: JWT-based registration and login system
- **LeetCode Integration**: Fetch and store LeetCode statistics using public APIs
- **Competitor Management**: Add and manage competitors to track their progress
- **Leaderboard**: Compare your stats with competitors in real-time
- **Responsive Design**: Modern, mobile-friendly interface

## Technology Stack

### Frontend (Angular 20.0.0)
- Angular with standalone components
- Tailwind CSS for styling
- RxJS for state management
- JWT authentication
- Responsive design

### Backend (.NET 8 Web API)
- Entity Framework Core with PostgreSQL
- JWT authentication
- RESTful API design
- CORS enabled for frontend integration

### Database (PostgreSQL)
- User management
- LeetCode stats storage
- Competitor relationships

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/LeetCodeTracker.API
   ```

2. Update the connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=leetcode_tracker;Username=your_username;Password=your_password"
     }
   }
   ```

3. Install dependencies and run:
   ```bash
   dotnet restore
   dotnet run
   ```

The API will be available at `https://localhost:7000`

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. Update the API URL in `src/app/environment/environment.ts` if needed

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:4200`

### PostgreSQL Database Schema

The application will automatically create the following tables:

```sql
-- Users table
CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash TEXT NOT NULL,
    LeetCodeUsername VARCHAR(100) UNIQUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LeetCode stats table
CREATE TABLE LeetCodeStats (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER REFERENCES Users(Id) ON DELETE CASCADE,
    Username VARCHAR(100) UNIQUE NOT NULL,
    TotalSolved INTEGER DEFAULT 0,
    EasySolved INTEGER DEFAULT 0,
    MediumSolved INTEGER DEFAULT 0,
    HardSolved INTEGER DEFAULT 0,
    AcceptanceRate INTEGER DEFAULT 0,
    Ranking INTEGER DEFAULT 0,
    ContestRating INTEGER DEFAULT 0,
    ContestGlobalRanking INTEGER DEFAULT 0,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Competitors table
CREATE TABLE Competitors (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER REFERENCES Users(Id) ON DELETE CASCADE,
    LeetCodeUsername VARCHAR(100) NOT NULL,
    DisplayName VARCHAR(100),
    AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(UserId, LeetCodeUsername)
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### LeetCode Data
- `GET /api/leetcode/stats` - Get current user's stats
- `GET /api/leetcode/competitors` - Get user's competitors
- `POST /api/leetcode/competitors` - Add a competitor
- `DELETE /api/leetcode/competitors/{id}` - Remove a competitor
- `GET /api/leetcode/leaderboard` - Get leaderboard data

## Environment Variables

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your PostgreSQL connection string"
  },
  "JwtSettings": {
    "SecretKey": "Your JWT secret key (32+ characters)",
    "ExpiryInHours": 24
  },
  "LeetCodeAPI": {
    "BaseUrl": "https://leetcode-stats-api.herokuapp.com"
  }
}
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api'
};
```

## Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend Deployment
```bash
dotnet publish -c Release
# Deploy to your hosting provider with PostgreSQL support
```

## Security Features

- JWT token authentication
- Password hashing with BCrypt
- CORS configuration
- Input validation
- SQL injection protection through Entity Framework

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.