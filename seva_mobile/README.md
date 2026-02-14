# Ctrl-Alt-Devote

A modern React Native mobile application built with Expo for managing temple visits, room bookings, and seva services. The app provides a seamless experience for devotees to book rooms, participate in sevas, and track their booking history.

## 📱 Features

### Core Features
- **User Authentication** - Secure login and registration system
- **Profile Management** - Edit personal information and view booking history
- **Room Booking** - Book temple rooms with check-in/check-out dates
- **Seva Booking** - Participate in temple services and rituals
- **Booking History** - Track all room and seva bookings with status updates
- **Multilingual Support** - English and Kannada language support
- **Volunteer Portal** - Special features for registered volunteers

### User Experience
- **Material Design** - Beautiful UI using React Native Paper
- **Responsive Layout** - Works seamlessly on different screen sizes
- **Real-time Updates** - Live status updates for bookings
- **Offline Support** - Basic functionality without internet

## 🛠 Technology Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation and routing
- **React Native Paper** - Material Design components
- **React Native Safe Area Context** - Safe area handling
- **Lucide React Native** - Icon library
- **i18next** - Internationalization framework
- **Zustand** - State management

### Development Tools
- **Metro Bundler** - JavaScript bundler
- **Expo Dev Client** - Development environment
- **TypeScript Compiler** - Type checking and compilation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ctrl-Alt-Devote
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run on Android**
   ```bash
   npm run android
   ```

5. **Run on iOS**
   ```bash
   npm run ios
   ```

6. **Run on Web**
   ```bash
   npm run web
   ```

## 📁 Project Structure

```
Ctrl-Alt-Devote/
├── src/
│   ├── api/                 # API services and configurations
│   │   ├── bookingService.ts
│   │   ├── config.ts
│   │   └── sevaService.ts
│   ├── components/          # Reusable UI components
│   │   └── AlbumViewer.tsx
│   ├── i18n/               # Internationalization
│   │   ├── en.json         # English translations
│   │   └── kn.json         # Kannada translations
│   ├── navigation/         # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── screens/            # Screen components
│   │   ├── BookingScreen.tsx
│   │   ├── ContactUsScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ParamparaScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── RoomBookingScreen.tsx
│   │   └── VolunteersScreen.tsx
│   ├── store/              # State management
│   │   └── authStore.ts
│   └── utils/              # Utility functions
│       └── notifications.ts
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
├── App.tsx                 # Main app entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Configuration

### API Configuration
Update the API endpoints in `src/api/config.ts`:
```typescript
const ENV = {
    dev: {
        ios: 'http://<your-ip>:8080/api',
        android: 'http://10.0.2.2:8080/api',
    },
    prod: {
        url: 'https://api.sodematha.com/api',
    }
};
```

### Environment Variables
The app uses different configurations for development and production environments automatically.

## 📱 Screens Overview

### 1. Home Screen
- Welcome message
- Quick access to main features
- Navigation to all sections

### 2. Profile Screen
- User information display
- Edit profile functionality
- **Booking History** - View room and seva bookings with status
- Logout functionality

### 3. Booking Screen
- Room booking interface
- Date selection
- Guest and room count selection

### 4. Seva/Volunteers Screen
- Available sevas list
- Booking interface for volunteers
- Seva history tracking

### 5. Parampara Screen
- Temple lineage information
- Historical context

### 6. Contact Us Screen
- Temple contact information
- Location details
- Communication channels

## 🌐 Internationalization

The app supports multiple languages:
- **English** - Default language
- **Kannada** - Local language support

Translation files are located in `src/i18n/`:
- `en.json` - English translations
- `kn.json` - Kannada translations

## 📦 Dependencies

### Main Dependencies
- `expo` - Expo framework
- `react-native` - React Native core
- `react-native-paper` - UI components
- `@react-navigation/native` - Navigation
- `react-i18next` - Internationalization
- `zustand` - State management

### Development Dependencies
- `@types/react` - TypeScript types
- `typescript` - TypeScript compiler

## 🔐 Authentication

The app uses token-based authentication:
- JWT tokens for secure API communication
- AsyncStorage for token persistence
- Automatic token refresh handling

## 📋 Booking System

### Room Booking Features
- Check-in/Check-out date selection
- Guest count specification
- Room count selection
- Real-time status updates (Pending, Confirmed, Approved, Cancelled, Completed)

### Seva Booking Features
- Seva selection from available options
- Devotee information collection
- Amount payment tracking
- Status monitoring

### Booking Status Flow
1. **Pending** - Initial booking state
2. **Confirmed** - Booking confirmed by system
3. **Approved** - Approved by administrator (if applicable)
4. **Completed** - Service/booking completed
5. **Cancelled** - Booking cancelled by user

## 🎨 UI/UX Features

### Design System
- Material Design 3 principles
- Consistent color theming
- Responsive layouts
- Accessibility support

### Components
- Custom cards for booking display
- Status chips with color coding
- Smooth animations and transitions
- Loading states and error handling

## 🚀 Build and Deployment

### Development Build
```bash
npm start          # Start Metro bundler
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
```

### Production Build
```bash
expo build:android    # Build Android APK/AAB
expo build:ios        # Build iOS IPA
```

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler conflicts**
   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

4. **API connection issues**
   - Check API configuration in `src/api/config.ts`
   - Ensure backend server is running
   - Verify network connectivity

### Debugging
- Use Expo Dev Client for debugging
- Check Metro bundler logs for errors
- Use React DevTools for component inspection

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Contact the development team
- Check the documentation
- Review the troubleshooting section

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Platform**: React Native with Expo
