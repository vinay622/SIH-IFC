import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  Users, 
  BarChart3,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  Filter,
  Search,
  Eye
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const AgriOfficerDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('escalated-queries');
  const [escalatedQueries, setEscalatedQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [systemStats, setSystemStats] = useState(null);

  // Mock data
  useEffect(() => {
    setEscalatedQueries([
      {
        id: 1,
        farmerId: 'F001',
        farmerName: 'Ravi Kumar',
        query: 'My coconut trees have white spots on leaves and some fruits are falling prematurely. I tried organic pesticides but no improvement.',
        category: 'Pest Control',
        priority: 'high',
        images: ['coconut1.jpg', 'coconut2.jpg'],
        location: 'Kochi, Kerala',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'pending',
        aiConfidence: 0.3,
        aiResponse: 'This appears to be a fungal infection. However, detailed analysis by an expert is recommended.'
      },
      {
        id: 2,
        farmerId: 'F002',
        farmerName: 'Priya Nair',
        query: 'Rice crop showing yellowing and stunted growth. Soil test shows pH 8.2. What should I do?',
        category: 'Soil Management',
        priority: 'medium',
        images: ['rice1.jpg'],
        location: 'Thrissur, Kerala',
        timestamp: '2024-01-15T09:15:00Z',
        status: 'pending',
        aiConfidence: 0.4,
        aiResponse: 'High pH is likely causing nutrient deficiency. Consider soil amendments.'
      }
    ]);

    setSystemStats({
      totalQueries: 1250,
      escalatedQueries: 45,
      resolvedQueries: 1180,
      activeUsers: 850,
      queryCategories: {
        labels: ['Pest Control', 'Soil Management', 'Fertilizers', 'Disease', 'Weather'],
        datasets: [{
          label: 'Queries by Category',
          data: [320, 280, 200, 250, 200],
          backgroundColor: 'rgba(34, 197, 94, 0.8)'
        }]
      },
      monthlyTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Total Queries',
          data: [180, 220, 190, 250, 210, 280],
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        }, {
          label: 'Escalated Queries',
          data: [8, 12, 9, 15, 11, 18],
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        }]
      }
    });
  }, []);

  const sidebarItems = [
    { id: 'escalated-queries', name: t('dashboard.admin.escalatedQueries'), icon: AlertTriangle },
    { id: 'user-management', name: t('dashboard.admin.userManagement'), icon: Users },
    { id: 'system-analytics', name: t('dashboard.admin.systemAnalytics'), icon: BarChart3 },
    { id: 'content-moderation', name: t('dashboard.admin.contentModeration'), icon: MessageSquare }
  ];

  const handleRespondToQuery = (queryId) => {
    if (!responseText.trim()) return;

    setEscalatedQueries(prev => 
      prev.map(query => 
        query.id === queryId 
          ? { 
              ...query, 
              status: 'resolved',
              expertResponse: responseText,
              resolvedAt: new Date().toISOString()
            }
          : query
      )
    );

    setResponseText('');
    setSelectedQuery(null);
  };

  const renderEscalatedQueries = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('dashboard.admin.escalatedQueries')}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search queries..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="lg:col-span-2 space-y-4">
          {escalatedQueries.map((query) => (
            <div 
              key={query.id} 
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 cursor-pointer transition-all ${
                query.priority === 'high' ? 'border-red-500' :
                query.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
              } ${selectedQuery?.id === query.id ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedQuery(query)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{query.farmerName}</h3>
                  <p className="text-sm text-gray-600">{query.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    query.priority === 'high' ? 'bg-red-100 text-red-800' :
                    query.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {query.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    query.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {query.status === 'pending' ? <Clock className="w-3 h-3 inline mr-1" /> : <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {query.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-900 mb-3">{query.query}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{query.category}</span>
                <span>AI Confidence: {(query.aiConfidence * 100).toFixed(0)}%</span>
              </div>

              {query.images && query.images.length > 0 && (
                <div className="mt-3 flex space-x-2">
                  {query.images.map((img, idx) => (
                    <div key={idx} className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Query Details & Response Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {selectedQuery ? (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Query Details</h3>
              
              <div className="space-y-2">
                <p><strong>Farmer:</strong> {selectedQuery.farmerName}</p>
                <p><strong>Category:</strong> {selectedQuery.category}</p>
                <p><strong>Priority:</strong> {selectedQuery.priority}</p>
                <p><strong>AI Response:</strong></p>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedQuery.aiResponse}</p>
              </div>

              {selectedQuery.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expert Response
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Provide detailed expert advice..."
                    />
                  </div>
                  
                  <button
                    onClick={() => handleRespondToQuery(selectedQuery.id)}
                    disabled={!responseText.trim()}
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Response
                  </button>
                </div>
              )}

              {selectedQuery.status === 'resolved' && selectedQuery.expertResponse && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Expert Response:</p>
                  <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                    {selectedQuery.expertResponse}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Select a query to view details and respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('dashboard.admin.userManagement')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">850</p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Farmers</p>
              <p className="text-2xl font-bold text-gray-900">650</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sellers</p>
              <p className="text-2xl font-bold text-gray-900">200</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Recent User Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Amit Sharma</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Farmer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kochi, Kerala</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('dashboard.admin.systemAnalytics')}
      </h2>
      
      {systemStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Query Categories</h3>
            <Bar data={systemStats.queryCategories} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
            <Line data={systemStats.monthlyTrends} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{systemStats.totalQueries}</p>
                <p className="text-sm text-gray-600">Total Queries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{systemStats.escalatedQueries}</p>
                <p className="text-sm text-gray-600">Escalated</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{systemStats.resolvedQueries}</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{systemStats.activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'escalated-queries':
        return renderEscalatedQueries();
      case 'user-management':
        return renderUserManagement();
      case 'system-analytics':
        return renderSystemAnalytics();
      case 'content-moderation':
        return <div>Content moderation tools coming soon...</div>;
      default:
        return renderEscalatedQueries();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">
            {t('dashboard.admin.title')}
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AgriOfficerDashboard;
