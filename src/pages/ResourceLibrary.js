import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Video, 
  FileText,
  Cloud,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Tag
} from 'lucide-react';

const ResourceLibrary = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const resourceTypes = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'articles', name: t('resources.articles'), icon: FileText },
    { id: 'videos', name: t('resources.videos'), icon: Video },
    { id: 'guides', name: t('resources.guides'), icon: BookOpen },
    { id: 'reports', name: t('resources.weatherReports'), icon: Cloud }
  ];

  const categories = [
    'Crop Management',
    'Pest Control', 
    'Soil Health',
    'Weather',
    'Market Information',
    'Government Schemes',
    'Technology',
    'Organic Farming'
  ];

  useEffect(() => {
    // Mock data
    const mockResources = [
      {
        id: 1,
        title: 'Complete Guide to Rice Cultivation in Kerala',
        description: 'A comprehensive guide covering all aspects of rice farming including variety selection, planting, irrigation, and harvesting.',
        type: 'guides',
        category: 'Crop Management',
        author: 'Kerala Agricultural University',
        publishDate: '2024-01-10',
        downloadCount: 1250,
        views: 3400,
        fileSize: '2.5 MB',
        language: 'Malayalam',
        rating: 4.8,
        featured: true
      },
      {
        id: 2,
        title: 'Organic Pest Control Methods - Video Series',
        description: 'Learn effective organic methods to control common pests in vegetable crops without harmful chemicals.',
        type: 'videos',
        category: 'Pest Control',
        author: 'Organic Farming Institute',
        publishDate: '2024-01-08',
        downloadCount: 890,
        views: 2100,
        duration: '45 minutes',
        language: 'Malayalam',
        rating: 4.6,
        featured: false
      },
      {
        id: 3,
        title: 'Weather Forecast and Advisory - January 2024',
        description: 'Monthly weather report with farming recommendations for different crops based on expected weather patterns.',
        type: 'reports',
        category: 'Weather',
        author: 'India Meteorological Department',
        publishDate: '2024-01-01',
        downloadCount: 2340,
        views: 5600,
        fileSize: '1.8 MB',
        language: 'English',
        rating: 4.5,
        featured: true
      },
      {
        id: 4,
        title: 'Soil Testing and Nutrient Management',
        description: 'Understanding soil testing results and making informed decisions about fertilizer application.',
        type: 'articles',
        category: 'Soil Health',
        author: 'ICAR Research',
        publishDate: '2024-01-05',
        downloadCount: 567,
        views: 1200,
        readTime: '15 minutes',
        language: 'English',
        rating: 4.7,
        featured: false
      },
      {
        id: 5,
        title: 'Market Prices and Trends - Week 2, January 2024',
        description: 'Current market prices for major crops and analysis of price trends for better selling decisions.',
        type: 'reports',
        category: 'Market Information',
        author: 'Agricultural Marketing Division',
        publishDate: '2024-01-14',
        downloadCount: 1890,
        views: 4200,
        fileSize: '0.8 MB',
        language: 'Malayalam',
        rating: 4.4,
        featured: false
      }
    ];

    setResources(mockResources);
    setFilteredResources(mockResources);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = resources;

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [resources, selectedType, selectedCategory, searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type) => {
    const typeMap = {
      articles: FileText,
      videos: Video,
      guides: BookOpen,
      reports: Cloud
    };
    const IconComponent = typeMap[type] || FileText;
    return <IconComponent className="w-5 h-5" />;
  };

  const featuredResources = resources.filter(resource => resource.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('resources.title')}
          </h1>
          <p className="text-gray-600">
            Access valuable agricultural knowledge, guides, and latest updates
          </p>
        </div>

        {/* Featured Resources */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource) => (
              <div key={resource.id} className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  {getTypeIcon(resource.type)}
                  <span className="ml-2 text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-primary-100 text-sm mb-3 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>{resource.author}</span>
                  <button className="bg-white text-primary-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resource Types */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resource Types</h3>
              <div className="space-y-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedType === type.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <type.icon className="w-4 h-4 mr-2" />
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === ''
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {filteredResources.length} resources
                </p>
              </div>

              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {getTypeIcon(resource.type)}
                          <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {resource.type}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {resource.category}
                          </span>
                          {resource.featured && (
                            <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-700 mb-3">
                          {resource.description}
                        </p>

                        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(resource.publishDate)}
                          </span>
                          <span>By {resource.author}</span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {resource.views} views
                          </span>
                          <span className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {resource.downloadCount} downloads
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {resource.fileSize && <span>{resource.fileSize}</span>}
                            {resource.duration && <span>{resource.duration}</span>}
                            {resource.readTime && <span>{resource.readTime}</span>}
                            <span>{resource.language}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < Math.floor(resource.rating)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="ml-1 text-sm text-gray-600">
                                ({resource.rating})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ml-6 flex flex-col space-y-2">
                        <button className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </button>
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;
