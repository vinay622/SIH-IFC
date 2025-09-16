import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Share2,
  Calendar,
  User,
  Tag
} from 'lucide-react';

const CommunityForum = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    // Mock data
    const mockPosts = [
      {
        id: 1,
        title: 'Best time to plant rice in Kerala?',
        content: 'I am planning to start rice cultivation next month. What would be the ideal time considering the current weather conditions?',
        author: 'Ravi Kumar',
        authorAvatar: 'RK',
        category: 'Rice Cultivation',
        timestamp: '2024-01-15T10:30:00Z',
        likes: 15,
        replies: 8,
        trending: true
      },
      {
        id: 2,
        title: 'Organic pest control methods for coconut trees',
        content: 'Has anyone tried organic methods to control rhinoceros beetles in coconut trees? Looking for eco-friendly solutions.',
        author: 'Priya Nair',
        authorAvatar: 'PN',
        category: 'Pest Control',
        timestamp: '2024-01-14T15:20:00Z',
        likes: 23,
        replies: 12,
        trending: false
      },
      {
        id: 3,
        title: 'Government subsidies for drip irrigation',
        content: 'Can someone share information about the latest government schemes for drip irrigation systems?',
        author: 'Suresh Menon',
        authorAvatar: 'SM',
        category: 'Government Schemes',
        timestamp: '2024-01-13T09:45:00Z',
        likes: 31,
        replies: 18,
        trending: true
      }
    ];

    const mockCategories = [
      'Rice Cultivation',
      'Pest Control',
      'Government Schemes',
      'Soil Management',
      'Market Prices',
      'Equipment',
      'General Discussion'
    ];

    setPosts(mockPosts);
    setCategories(mockCategories);
  }, []);

  const handleCreatePost = (e) => {
    e.preventDefault();
    
    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: 'Current User', // Would come from auth context
      authorAvatar: 'CU',
      category: newPost.category,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
      trending: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: '' });
    setShowCreatePost(false);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingPosts = posts.filter(post => post.trending).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('community.title')}
          </h1>
          <p className="text-gray-600">
            Connect with fellow farmers, share experiences, and learn together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Create Post */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('community.categories')}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('community.createPost')}
                </button>
              </div>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('community.createPost')}
                    </h3>
                  </div>
                  
                  <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        rows={6}
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowCreatePost(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                        {post.authorAvatar}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{post.author}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatTimeAgo(post.timestamp)}
                          <span className="mx-2">•</span>
                          <Tag className="w-4 h-4 mr-1" />
                          {post.category}
                        </div>
                      </div>
                    </div>
                    
                    {post.trending && (
                      <span className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-700 mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-primary-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes} {t('community.like')}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 hover:text-primary-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.replies} {t('community.reply')}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 hover:text-primary-600">
                      <Share2 className="w-4 h-4" />
                      <span>{t('community.share')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
                <p className="text-gray-600">Try adjusting your search or create a new post</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                {t('community.trending')}
              </h3>
              <div className="space-y-3">
                {trendingPosts.map((post) => (
                  <div key={post.id} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{post.replies} replies</span>
                      <span className="mx-1">•</span>
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('community.categories')}
              </h3>
              <div className="space-y-2">
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

            {/* Community Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-medium">1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Now</span>
                  <span className="font-medium text-green-600">87</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
