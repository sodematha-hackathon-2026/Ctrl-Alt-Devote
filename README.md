# Ctrl+Alt+Devote

A comprehensive digital platform for Sri Vadiraja Matha, built for the Sode Sri Vadiraja Matha Vaibhavotsava Hackathon 2026. This platform enables devotees to connect with the matha through seamless seva bookings, accommodation reservations, and real-time updates.

## About the Project

Ctrl+Alt+Devote is a modern, full-stack application that bridges traditional spiritual practices with cutting-edge technology. The platform serves as a digital gateway for devotees worldwide to:

- Book seva services and make secure online payments
- Reserve accommodation at the matha
- Stay updated with daily alankara and temple events
- Participate in volunteer opportunities
- Access temple timings and important information

## Architecture Overview

This project follows a microservices architecture with three main components:

```
Ctrl+Alt+Devote/
├── seva_mobile/          # React Native mobile application
├── seva_platform/        # Spring Boot backend API
└── seva_ui/             # React web dashboard
```

## Components

### seva_mobile - Mobile Application
**Technology Stack:**
- React Native with Expo SDK 54
- TypeScript for type safety
- React Navigation for seamless navigation
- Zustand for state management
- React Native Paper for Material Design components
- Razorpay integration for payments
- Voice recognition capabilities
- Multi-language support with i18next

**Key Features:**
- OTP-based authentication
- Seva booking with payment integration
- Room reservation system
- Real-time notifications
- Image capture and upload
- Interactive maps for location services
- Voice commands for accessibility

### seva_platform - Backend Services
**Technology Stack:**
- Java 21 with Spring Boot 4.0.2
- Spring Security with JWT authentication
- Spring Data JPA with PostgreSQL
- Elasticsearch for search capabilities
- Razorpay for payment processing
- AWS S3 for file storage
- SpringDoc OpenAPI for API documentation

**Key Features:**
- RESTful API with comprehensive endpoints
- OTP-based user authentication
- Payment gateway integration
- File upload and management
- Admin panel for content management
- Real-time notifications
- Comprehensive booking management

### seva_ui - Web Dashboard
**Technology Stack:**
- React 18 with TypeScript
- Vite for fast development and building
- React Router for navigation
- Recharts for data visualization
- AWS SDK for S3 integration
- Axios for API communication

**Key Features:**
- Admin dashboard for content management
- Analytics and reporting
- User management interface
- Booking management system
- Gallery and content management

## Getting Started

### Prerequisites

**For Mobile Development:**
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

**For Backend Development:**
- Java 21 JDK
- Maven 3.6+
- PostgreSQL 14+
- Docker (optional, for containerization)

**For Web UI Development:**
- Node.js 18+ and npm/yarn
- Modern web browser

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/sodematha-hackathon-2026/Ctrl-Alt-Devote
cd Ctrl-Alt-Devote
```

#### 2. Backend Setup (seva_platform)
```bash
cd seva_platform

# Configure environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Install dependencies and run
./mvnw install
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`
API Documentation: `http://localhost:8080/swagger-ui.html`

#### 3. Mobile App Setup (seva_mobile)
```bash
cd seva_mobile

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run android    # For Android
npm run ios        # For iOS
npm run web        # For web version
```

#### 4. Web UI Setup (seva_ui)
```bash
cd seva_ui

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The web dashboard will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seva_platform
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name

# Email Configuration
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user profile

### Booking Endpoints
- `GET /api/bookings/history` - Get user's complete booking history
- `POST /api/bookings/room` - Book accommodation
- `POST /api/bookings/seva/initiate` - Initiate seva booking
- `POST /api/bookings/seva/complete` - Complete seva booking with payment

### Content Endpoints
- `GET /api/content/events` - Get temple events
- `GET /api/content/gallery/albums` - Get photo albums
- `GET /api/content/timings` - Get temple timings
- `GET /api/alankara/latest` - Get latest daily alankara

## Database Schema

Key entities:
- **Users** - User profiles and authentication data
- **SevaBooking** - Seva service bookings with payment status
- **RoomBooking** - Accommodation reservations
- **Seva** - Available seva services and pricing
- **Event** - Temple events and schedules
- **DailyAlankara** - Daily temple decorations
- **Volunteer** - Volunteer opportunities and applications

## Payment Integration

The platform integrates with Razorpay for secure payment processing:
- Order creation and management
- Payment verification and callbacks
- Webhook handling for payment confirmations
- Support for multiple payment methods

## Cloud Infrastructure

**AWS S3** for file storage:
- Image uploads for alankara
- Gallery photos and albums
- User profile pictures
- Document storage

**Deployment Options:**
- Docker containerization support
- Kubernetes deployment ready
- Cloud platform agnostic design

## Development & Testing

### Running Tests
```bash
# Backend tests
cd seva_platform
./mvnw test

# Frontend tests
cd seva_ui
npm run test

# Mobile tests
cd seva_mobile
npm run test
```

### Development Notes
- OTP simulation is enabled for development
- Database schema is auto-created on startup
- Hot reload enabled for all frontend components
- Comprehensive error handling and logging

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/Ctrl-Alt-Devote.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Ensure all tests pass

### Code Style Guidelines
- Use TypeScript for type safety
- Follow ESLint configurations
- Write meaningful commit messages
- Add comments for complex logic
- Maintain test coverage above 80%

## Acknowledgments

- **Sode Sri Vadiraja Matha** - For the opportunity to serve
- **Hackathon Organizers** - For organizing this wonderful event
- **Contributors** - Everyone who has helped build this platform

---
