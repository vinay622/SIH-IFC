import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  ShoppingCart, 
  Calculator,
  BookOpen,
  Users,
  TrendingUp,
  Leaf,
  Bot,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Advisory',
      description: 'Get instant expert advice on farming practices, pest control, and crop management in Malayalam, English, or Hindi.',
      color: 'text-blue-500'
    },
    {
      icon: MessageSquare,
      title: 'Voice & Image Support',
      description: 'Ask questions using voice commands or upload images of your crops for AI-powered analysis and recommendations.',
      color: 'text-green-500'
    },
    {
      icon: ShoppingCart,
      title: 'Agricultural Marketplace',
      description: 'Buy and sell farming equipment, seeds, fertilizers, and produce directly with fellow farmers and suppliers.',
      color: 'text-purple-500'
    },
    {
      icon: Calculator,
      title: 'Loan Calculator',
      description: 'Calculate agricultural loan EMIs and plan your finances with our interactive loan calculator.',
      color: 'text-yellow-500'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with farmers across India, share experiences, and learn from the agricultural community.',
      color: 'text-red-500'
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Access extensive collection of farming guides, weather reports, market prices, and government schemes.',
      color: 'text-indigo-500'
    }
  ];

  const testimonials = [
    {
      name: 'Ravi Kumar',
      role: 'Rice Farmer, Kerala',
      quote: 'IFC has revolutionized how I manage my farm. The AI advisor helped me identify and treat a pest problem early, saving my entire crop.',
      rating: 5
    },
    {
      name: 'Priya Nair',
      role: 'Organic Farmer, Kerala',
      quote: 'The marketplace feature helped me sell my organic produce at better prices. The community is very supportive and knowledgeable.',
      rating: 5
    },
    {
      name: 'Suresh Menon',
      role: 'Equipment Seller, Kerala',
      quote: 'As a tractor dealer, IFC marketplace has connected me with farmers who really need my services. Great platform for agricultural business.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Farmers' },
    { number: '50,000+', label: 'Queries Resolved' },
    { number: '5,000+', label: 'Products Listed' },
    { number: '98%', label: 'User Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">IFC</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Indian Farmers Club
            </h2>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              AI-Powered Agricultural Advisory System for Smart Farming
            </p>
            <p className="text-lg text-primary-200 mb-12 max-w-2xl mx-auto">
              Get expert advice in Malayalam, English, or Hindi. Connect with fellow farmers. 
              Access marketplace and resources - all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/marketplace')}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Explore Marketplace
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                onClick={() => navigate('/resources')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                View Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources modern farmers need to succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className={`${feature.color} mb-4`}>
                  <feature.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How IFC Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get started with smart farming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sign Up & Choose Role
              </h3>
              <p className="text-gray-600">
                Create your account and select whether you're a farmer, seller, or agricultural officer
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ask Questions or Browse
              </h3>
              <p className="text-gray-600">
                Use our AI advisor for farming queries or browse the marketplace for equipment and produce
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Expert Advice
              </h3>
              <p className="text-gray-600">
                Receive AI-powered recommendations or get connected with agricultural experts for complex issues
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Hear from farmers who have transformed their agriculture with IFC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose IFC?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Multilingual Support</h4>
                    <p className="text-gray-600">Available in Malayalam, English, and Hindi for better accessibility</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AI-Powered Insights</h4>
                    <p className="text-gray-600">Get instant, accurate advice powered by advanced AI technology</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Network</h4>
                    <p className="text-gray-600">Access to agricultural experts when AI recommendations need human verification</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Comprehensive Platform</h4>
                    <p className="text-gray-600">Everything from advisory to marketplace in one integrated platform</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 rounded-xl text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Farming?</h3>
              <p className="text-primary-100 mb-6">
                Join thousands of farmers who are already using IFC to improve their agricultural practices and increase their income.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">IFC</span>
                </div>
                <span className="text-xl font-bold">Indian Farmers Club</span>
              </div>
              <p className="text-gray-400">
                Empowering farmers with AI-powered advisory and comprehensive agricultural resources.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Advisor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Indian Farmers Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
