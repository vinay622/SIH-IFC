# IFC - Indian Farmers Club

🌾 AI-Powered Agricultural Advisory System for Smart Farming

## 📋 Overview

IFC (Indian Farmers Club) is a comprehensive web portal designed specifically for Indian farmers, providing AI-powered agricultural advisory services, marketplace functionality, community features, and educational resources. The platform supports multiple languages (Malayalam, English, Hindi) and caters to different user roles including farmers, agricultural equipment sellers, and agricultural officers.

## ✨ Features

### 🤖 AI-Powered Advisory
- **Smart Chat Interface**: Ask questions about farming practices, pest control, crop management
- **Voice Input Support**: Voice recognition specifically optimized for Malayalam language
- **Image Analysis**: Upload crop images for AI-powered disease and pest identification
- **Expert Escalation**: Complex queries can be escalated to human agricultural experts
- **Query History**: Track and revisit previous conversations and advice

### 🛒 Agricultural Marketplace
- **Buy & Sell**: Equipment, seeds, fertilizers, and agricultural produce
- **Advanced Filtering**: Search by category, price range, location, and seller ratings
- **Product Management**: Sellers can easily list, update, and manage their products
- **Secure Transactions**: Built-in communication and transaction tracking

### 🏦 Financial Tools
- **Loan Calculator**: Interactive EMI calculator for agricultural loans
- **Real-time Calculations**: Instant updates with principal, interest, and tenure adjustments
- **Visual Breakdown**: Charts showing payment distribution and trends

### 👥 Community Features
- **Discussion Forum**: Connect with farmers across India
- **Knowledge Sharing**: Share experiences, tips, and best practices
- **Trending Topics**: Stay updated with community interests and discussions
- **Category-based Organization**: Organized discussions by crop type, region, and farming methods

### 📚 Resource Library
- **Educational Content**: Comprehensive farming guides and tutorials
- **Weather Reports**: Real-time weather data and forecasts
- **Market Prices**: Current commodity prices and trends
- **Government Schemes**: Information about agricultural subsidies and programs
- **Downloadable Resources**: PDFs, guides, and reference materials

### 🌐 Multilingual Support
- **Primary Languages**: Malayalam (default), English, Hindi
- **Seamless Switching**: Instant language switching with persistent preferences
- **Localized Content**: All interface elements and content in native languages

## 🏗️ Technical Architecture

### Frontend Stack
- **React.js 18.2.0**: Modern functional components with hooks
- **React Router v6**: Client-side routing and navigation
- **Tailwind CSS 3.1.8**: Utility-first styling with custom agricultural theme
- **Chart.js 3.9.1**: Data visualization for analytics and reports
- **i18next 21.9.1**: Internationalization and localization
- **Axios**: HTTP client for API communication
- **React Dropzone**: File upload with drag-and-drop support

### Key Components
```
src/
├── components/
│   ├── auth/           # Authentication modals and forms
│   ├── layout/         # Header, navigation, and layout components
│   └── common/         # Reusable UI components
├── context/
│   ├── AuthContext.js  # User authentication and session management
│   └── LanguageContext.js # Multilingual support and language switching
├── pages/
│   ├── LandingPage.js  # Public homepage with features showcase
│   ├── *Dashboard.js   # Role-specific dashboards (Farmer, Seller, AgriOfficer)
│   ├── Marketplace.js  # Product listing and marketplace
│   ├── CommunityForum.js # Discussion forum
│   └── ResourceLibrary.js # Educational resources
├── services/
│   └── api.js          # Centralized API service layer
└── styles/
    └── globals.css     # Global styles and utility classes
```

### User Roles & Permissions

#### 🌾 Farmer Dashboard
- AI advisory chat interface
- Query history and saved conversations
- Marketplace access for buying equipment and selling produce
- Loan calculator and financial planning tools
- Community forum participation
- Resource library access
- Notifications and updates

#### 🏪 Seller Dashboard
- Product listing and inventory management
- Sales analytics and performance charts
- Order management and customer communication
- Marketplace optimization tools
- Revenue tracking and reporting

#### 👨‍🌾 Agricultural Officer Dashboard
- Escalated query management and expert consultation
- User management and platform moderation
- System analytics and usage statistics
- Content management for resources and schemes
- Community moderation tools

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIH-IFC
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SPEECH_API_KEY=your_speech_api_key
   REACT_APP_WEATHER_API_KEY=your_weather_api_key
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
# or
yarn build
```

## 🔧 Configuration

### Language Configuration
The application supports three languages out of the box:
- Malayalam (ml) - Default
- English (en)
- Hindi (hi)

Language preferences are automatically saved to localStorage and persist across sessions.

### Theme Customization
The application uses a custom agricultural theme with green color palette:
- Primary colors: Various shades of green (#22c55e to #14532d)
- Secondary colors: Yellow/amber for highlights
- Neutral grays for text and backgrounds

### API Integration
The application is designed to work with a REST API backend. All API calls are centralized in `src/services/api.js` with:
- Automatic authentication token injection
- Error handling and retry logic
- Request/response interceptors
- Loading state management

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with multi-column layouts
- **Tablet**: Optimized layouts with touch-friendly interfaces
- **Mobile**: Mobile-first design with simplified navigation

### Accessibility Features
- ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader optimization
- Focus management and visual indicators

## 🌟 Key Features Deep Dive

### AI Chat Interface
- Real-time messaging with AI responses
- Support for text, voice, and image inputs
- Context-aware conversations
- Malayalam voice recognition using Web Speech API
- Image upload with crop analysis capabilities

### Marketplace Functionality
- Grid and list view options
- Advanced filtering and search
- Seller ratings and reviews
- Product categories: Equipment, Seeds, Fertilizers, Produce
- Location-based results

### Community Forum
- Post creation with rich text support
- Comment threads and discussions
- Trending topics and popular posts
- Category-based organization
- User profiles and reputation system

## 🔐 Security Considerations

- JWT token-based authentication
- Secure localStorage for session management
- Input validation and sanitization
- CORS protection
- Rate limiting on API calls
- Image upload validation and processing

## 🚀 Performance Optimizations

- Lazy loading for route components
- Image optimization and compression
- API response caching
- Debounced search inputs
- Virtualized lists for large datasets
- Bundle splitting and code optimization

## 🧪 Testing

The application is structured to support comprehensive testing:
- Component unit tests with Jest and React Testing Library
- API integration tests
- Accessibility testing
- Cross-browser compatibility testing
- Mobile responsiveness testing

## 📈 Analytics Integration

Built-in analytics support for:
- User engagement tracking
- Feature usage analytics
- Performance monitoring
- Error reporting and crash analytics
- A/B testing capability

## 🤝 Contributing

We welcome contributions to improve the IFC platform:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript-style prop validation
- Maintain consistent code formatting with Prettier
- Write meaningful commit messages
- Include tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Smart India Hackathon**: For providing the platform and problem statement
- **Agricultural Experts**: For domain knowledge and requirements
- **Farmer Communities**: For user feedback and testing
- **Open Source Libraries**: React, Tailwind CSS, and all other dependencies

## 📞 Support

For support and questions:
- 📧 Email: support@ifc.com
- 📱 Phone: +91-XXXX-XXXX-XX
- 🌐 Website: [https://ifc.com](https://ifc.com)
- 📖 Documentation: [https://docs.ifc.com](https://docs.ifc.com)

---

**Made with ❤️ for Indian Farmers**

*Empowering agriculture through technology and community*
