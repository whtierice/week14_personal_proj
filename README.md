# Fitness Tracker: A Modern Web Application for Exercise Tracking and Community Engagement

Fitness Tracker is a full-stack web application that helps users track their workout routines and engage with a fitness community. The application combines personal workout management with social features, providing a comprehensive platform for fitness enthusiasts.

The application is built using React with TypeScript for the frontend and NestJS for the backend, offering a robust and type-safe development environment. It features workout routine management, exercise tracking with real-time progress monitoring, and a community board for sharing fitness tips and experiences.

## Repository Structure
```
.
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Board/        # Forum-related components
│   │   │   ├── Exercise/     # Exercise tracking components
│   │   │   ├── Layout/       # Layout and navigation components
│   │   │   └── Routine/      # Workout routine components
│   │   ├── pages/            # Page-level components
│   │   └── types/            # TypeScript type definitions
│   └── package.json          # Frontend dependencies and scripts
├── server/                    # NestJS backend application
│   ├── src/
│   │   ├── boards/           # Forum functionality module
│   │   ├── app.module.ts     # Main application module
│   │   └── main.ts          # Application entry point
│   └── package.json         # Backend dependencies and scripts
└── Dockerfile               # Container configuration for development
```

## Usage Instructions
### Prerequisites
- Node.js 18 LTS or higher
- npm (comes with Node.js)
- Docker (optional, for containerized development)

### Installation

#### Local Development Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd fitness-tracker
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

#### Docker Setup
1. Build and run using Docker:
```bash
docker build -t fitness-tracker .
docker run -it -p 3000:3000 -p 3001:3001 fitness-tracker
```

### Quick Start
1. Start the backend server:
```bash
cd server
npm run start:dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm start
```

3. Access the application at `http://localhost:3000`

### More Detailed Examples

#### Creating a Workout Routine
```typescript
const routine = {
  name: "Upper Body Workout",
  exercises: [
    { name: "Bench Press", sets: 4, reps: 10, weight: 60 },
    { name: "Shoulder Press", sets: 3, reps: 12, weight: 40 }
  ]
};
```

#### Tracking Workout Progress
```typescript
const workoutRecord = {
  routineId: "routine-id",
  date: new Date().toISOString(),
  duration: 3600, // in seconds
  completedExercises: ["exercise-1", "exercise-2"]
};
```

### Troubleshooting

#### Common Issues

1. **Port Already in Use**
```bash
# Error: EADDRINUSE: address already in use :::3000
# Solution: Kill the process using the port
lsof -i :3000
kill -9 <PID>
```

2. **Node Modules Issues**
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Data Flow
The application follows a client-server architecture with RESTful communication between the frontend and backend.

```ascii
[Client Browser] <--> [React Frontend] <--> [NestJS Backend] <--> [Database]
     |                      |                      |
     |                      |                      |
User Interface       State Management       Data Processing
```

Key component interactions:
1. User interactions trigger React component state updates
2. Frontend components make HTTP requests to the NestJS backend
3. Backend processes requests and performs database operations
4. Response data flows back to update the UI
5. Real-time workout tracking updates component state locally
6. Community posts and comments are synchronized through the backend
7. Exercise data is cached locally for offline functionality