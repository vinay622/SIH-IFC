import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart,
  MapPin,
  Phone,
  Star,
  Grid,
  List,
  Sort
} from 'lucide-react';

const Marketplace = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [location, setLocation] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'John Deere 5050D Tractor',
        description: 'Well-maintained 2020 model with 500 hours running time. Perfect for medium-scale farming.',
        price: 850000,
        originalPrice: 900000,
        category: 'Tractors',
        location: 'Kochi, Kerala',
        seller: {
          name: 'Ravi Kumar',
          phone: '+91 9876543210',
          rating: 4.5,
          verified: true
        },
        images: ['tractor1.jpg', 'tractor2.jpg'],
        condition: 'Used',
        year: 2020,
        featured: true,
        likes: 45,
        views: 320
      },
      {
        id: 2,
        name: 'Organic Rice Seeds - High Yield',
        description: 'Premium quality organic rice seeds with high yield potential. Suitable for Kerala climate.',
        price: 150,
        category: 'Seeds',
        location: 'Thrissur, Kerala',
        seller: {
          name: 'Kerala Seeds Co.',
          phone: '+91 9876543211',
          rating: 4.8,
          verified: true
        },
        images: ['seeds1.jpg'],
        condition: 'New',
        unit: 'per kg',
        featured: false,
        likes: 23,
        views: 156
      },
      {
        id: 3,
        name: 'NPK Fertilizer - 20:10:10',
        description: 'Balanced NPK fertilizer suitable for all crops. Increases yield and soil fertility.',
        price: 1200,
        category: 'Fertilizers',
        location: 'Palakkad, Kerala',
        seller: {
          name: 'Agri Solutions',
          phone: '+91 9876543212',
          rating: 4.3,
          verified: true
        },
        images: ['fertilizer1.jpg'],
        condition: 'New',
        unit: 'per 50kg bag',
        featured: false,
        likes: 12,
        views: 89
      },
      {
        id: 4,
        name: 'Power Weeder Machine',
        description: 'Efficient power weeder for small to medium farms. Reduces manual labor significantly.',
        price: 25000,
        originalPrice: 28000,
        category: 'Equipment',
        location: 'Ernakulam, Kerala',
        seller: {
          name: 'Farm Tech Solutions',
          phone: '+91 9876543213',
          rating: 4.6,
          verified: true
        },
        images: ['weeder1.jpg'],
        condition: 'New',
        featured: true,
        likes: 34,
        views: 203
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    
    const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
    setCategories(uniqueCategories);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Location filter
    if (location) {
      filtered = filtered.filter(product =>
        product.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      default: // newest
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, location, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 text-xs rounded">
            Featured
          </span>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.unit && (
            <span className="text-sm text-gray-500 ml-1">
              {product.unit}
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-medium">{product.seller.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{product.seller.name}</p>
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600 ml-1">{product.seller.rating}</span>
              </div>
            </div>
          </div>
          {product.seller.verified && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
              Verified
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {product.location}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-primary-600 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 mr-1" />
            {t('marketplace.addToCart')}
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex">
      {/* Image */}
      <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Product Image</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
          {product.featured && (
            <span className="bg-primary-500 text-white px-2 py-1 text-xs rounded">
              Featured
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {product.location}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs font-medium">{product.seller.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{product.seller.name}</p>
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">{product.seller.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="bg-primary-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-primary-600">
                {t('marketplace.contactSeller')}
              </button>
              <button className="border border-gray-300 py-2 px-4 rounded-lg text-sm hover:bg-gray-50">
                {t('marketplace.addToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('marketplace.title')}
          </h1>
          <p className="text-gray-600">
            Find the best agricultural products and equipment
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t('marketplace.categories')}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplace.priceRange')}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplace.location')}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setPriceRange([0, 1000000]);
                      setLocation('');
                      setSortBy('newest');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredProducts.length} results
          </p>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
