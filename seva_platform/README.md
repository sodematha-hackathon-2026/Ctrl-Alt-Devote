# Seva Platform Backend

Spring Boot backend application for Seva Platform.

## Features

- **User Authentication**: OTP-based authentication with JWT tokens
- **Seva Management**: Book and manage seva services with payment integration
- **Room Booking**: Accommodation booking system
- **Content Management**: Events, gallery, timings, and daily alankara
- **Volunteer Management**: Volunteer opportunities and applications
- **Admin Panel**: Content and user management for administrators

## Tech Stack

- **Java 21** with Spring Boot 4.0.2
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **Razorpay** for payment processing
- **AWS S3** for file storage
- **SpringDoc OpenAPI** for API documentation

## Environment Setup

1. Copy `.env.example` to `.env` and configure:
   - Database connection
   - JWT secrets
   - Razorpay credentials
   - AWS S3 credentials

2. Install dependencies:
   ```bash
   ./mvnw install
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user profile

### Bookings
- `GET /api/bookings/history` - Get user's complete booking history
- `GET /api/bookings/seva/user/{userId}` - Get user's seva bookings
- `GET /api/bookings/room/user/{userId}` - Get user's room bookings
- `POST /api/bookings/room` - Book a room
- `POST /api/bookings/seva/initiate` - Initiate seva booking
- `POST /api/bookings/seva/complete` - Complete seva booking with payment

### Content
- `GET /api/content/events` - Get events
- `GET /api/content/gallery/albums` - Get photo albums
- `GET /api/content/timings` - Get temple timings
- `GET /api/alankara/latest` - Get latest daily alankara

### Admin
- `GET /api/admin/content/*` - Manage content
- `GET /api/admin/users` - Manage users

## Development Notes

- OTP simulation is enabled for development - OTP is logged and returned in response
- Database schema is auto-created on startup
- API documentation available at `/swagger-ui.html`

## Database Schema

Key entities:
- `Users` - User profiles and authentication
- `SevaBooking` - Seva service bookings with payment
- `RoomBooking` - Accommodation bookings
- `Seva` - Available seva services
- `Event` - Temple events
- `DailyAlankara` - Daily decorations

## Payment Integration

Uses Razorpay for:
- Order creation
- Payment verification
- Webhook handling

## File Storage

AWS S3 integration for:
- Image uploads
- Gallery photos
- Alankara images