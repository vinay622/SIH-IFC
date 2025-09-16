import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, 
  ShoppingCart, 
  Calculator,
  History,
  Bell,
  User,
  Cloud,
  Leaf,
  TrendingUp,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import AIQueryInterface from '../components/ai/AIQueryInterface';
import LoanCalculator from '../components/tools/LoanCalculator';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('ai-advisor');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  // Mock data
  useEffect(() => {
    // Simulate fetching data
    setNotifications([
      { id: 1, type: 'weather', message: 'Heavy rain expected tomorrow', time: '2 hours ago' },
      { id: 2, type: 'market', message: 'Rice prices increased by 5%', time: '4 hours ago' },
      { id: 3, type: 'govt', message: 'New subsidy scheme available', time: '1 day ago' }
    ]);

    setWeatherData({
      temperature: 28,
      humidity: 75,
      rainfall: 'Light rain expected',
      recommendation: 'Good time for fertilizer application'
    });

    setQueryHistory([
      { id: 1, query: 'Best fertilizer for rice crop', date: '2024-01-15', status: 'resolved' },
      { id: 2, query: 'Pest control for coconut trees', date: '2024-01-14', status: 'pending' },
      { id: 3, query: 'Soil testing recommendations', date: '2024-01-13', status: 'resolved' }
    ]);
  }, []);

  const handleMessageSent = async (messageData) => {
    setIsLoading(true);
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageData.text,
      images: messageData.images,
      timestamp: messageData.timestamp
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Simulate API call to AI service
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Based on your query, I recommend using organic fertilizers for better soil health. For rice crops, a combination of NPK (20:10:10) would be ideal during the vegetative stage.',
          timestamp: new Date().toISOString(),
          confidence: 0.85
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'ai-advisor', name: t('dashboard.farmer.aiAdvisor'), icon: MessageSquare },
    { id: 'marketplace', name: t('dashboard.farmer.marketplace'), icon: ShoppingCart },
    { id: 'loan-calculator', name: t('dashboard.farmer.loanCalculator'), icon: Calculator },
    { id: 'query-history', name: t('dashboard.farmer.queryHistory'), icon: History },
    { id: 'notifications', name: t('dashboard.farmer.notifications'), icon: Bell },
    { id: 'profile', name: t('dashboard.farmer.profile'), icon: User }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'ai-advisor':
        return (
          <div className="h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('dashboard.farmer.aiAdvisor')}
              </h2>
              <p className="text-gray-600">
                Ask questions about farming, crop management, pest control, and more
              </p>
            </div>
            <div className="h-[calc(100vh-200px)]">
              <AIQueryInterface 
                messages={messages}
                onMessageSent={handleMessageSent}
                isLoading={isLoading}
              />
            </div>
          </div>
        );

      case 'marketplace':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('dashboard.farmer.marketplace')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick categories */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <Leaf className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900">Seeds & Fertilizers</h3>
                  <p className="text-sm text-gray-600 mt-2">High quality seeds and organic fertilizers</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900">Equipment</h3>
                  <p className="text-sm text-gray-600 mt-2">Farming tools and machinery</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <ShoppingCart className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900">Sell Produce</h3>
                  <p className="text-sm text-gray-600 mt-2">List your crops for sale</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'loan-calculator':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('dashboard.farmer.loanCalculator')}
            </h2>
            <LoanCalculator />
          </div>
        );

      case 'query-history':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('dashboard.farmer.queryHistory')}
            </h2>
            <div className="space-y-4">
              {queryHistory.map((query) => (
                <div key={query.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{query.query}</h3>
                      <p className="text-sm text-gray-600 mt-1">{query.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      query.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {query.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('dashboard.farmer.notifications')}
            </h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-primary-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-900">{notification.message}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notification.type === 'weather' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'market' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('dashboard.farmer.profile')}
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">Ravi Kumar</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">Kochi, Kerala</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">+91 9876543210</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Farm Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Primary Crop</p>
                        <p className="font-medium">Rice & Coconut</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Farm Size</p>
                        <p className="font-medium">5 acres</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium">15 years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">
            {t('dashboard.farmer.title')}
          </h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Weather Widget */}
        {weatherData && (
          <div className="mx-3 mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Cloud className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-blue-900">Weather</h3>
            </div>
            <div className="text-sm text-blue-800">
              <p>{weatherData.temperature}°C</p>
              <p>Humidity: {weatherData.humidity}%</p>
              <p className="mt-2 text-xs">{weatherData.recommendation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
