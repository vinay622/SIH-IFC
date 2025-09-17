import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Locate, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import mapService from '../services/mapService';

const MapComponent = ({ 
  locations = [], 
  products = [], // Add products prop for marketplace
  center = [10.8505, 76.2711], // Kerala default
  zoom = 10,
  height = '400px',
  showSearch = true,
  showControls = true,
  onLocationSelect = null,
  onProductSelect = null, // Add product selection handler
  selectedProduct = null, // Add selected product prop
  onMapClick = null,
  className = ''
}) => {
  const mapContainerRef = useRef(null);
  const mapIdRef = useRef(`map-${Math.random().toString(36).substr(2, 9)}`); // Unique ID
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    const container = mapContainerRef.current;
    const mapId = mapIdRef.current;
    
    if (container && !mapReady) {
      try {
        // Set the unique ID on the container
        container.id = mapId;
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          mapService.initializeMap(mapId, center, zoom);
          setMapReady(true);

          // Set up map click handler
          if (onMapClick) {
            mapService.onMapClick((e) => {
              onMapClick({
                lat: e.latlng.lat,
                lng: e.latlng.lng
              });
            });
          }
        }, 100);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapReady) {
        try {
          mapService.destroy();
        } catch (error) {
          console.warn('Error during map cleanup:', error);
        }
        setMapReady(false);
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Add location markers when locations or products change
  useEffect(() => {
    if (mapReady && (locations.length > 0 || products.length > 0)) {
      // Clear existing markers
      mapService.clearMarkers();

      // Add location markers
      locations.forEach(location => {
        const marker = mapService.addMarker(location.lat, location.lng, {
          popup: location.popup || location.name || 'Location',
          tooltip: location.tooltip,
          title: location.name
        });

        // Handle marker click
        if (onLocationSelect && marker) {
          mapService.onMarkerClick(marker, () => {
            onLocationSelect(location);
          });
        }
      });

      // Add product markers
      products.forEach(product => {
        if (product.coordinates) {
          const marker = mapService.addMarker(
            product.coordinates.lat, 
            product.coordinates.lng, 
            {
              popup: `
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-bold text-sm mb-1">${product.name}</h3>
                  <p class="text-xs text-gray-600 mb-1">${product.seller}</p>
                  <p class="text-sm font-semibold text-green-600">₹${product.price}</p>
                  <p class="text-xs text-gray-500">${product.location}</p>
                </div>
              `,
              title: product.name
            }
          );

          // Handle product marker click
          if (onProductSelect && marker) {
            mapService.onMarkerClick(marker, () => {
              onProductSelect(product);
            });
          }
        }
      });

      // Fit map to show all markers if multiple items
      const totalMarkers = locations.length + products.filter(p => p.coordinates).length;
      if (totalMarkers > 1) {
        setTimeout(() => mapService.fitBounds(), 100);
      }
    }
  }, [locations, products, mapReady, onLocationSelect, onProductSelect]);

  // Search functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await mapService.searchLocation(searchQuery, {
        limit: 10,
        countryCode: 'in'
      });
      
      setSearchResults(results);
      setShowSuggestions(true);

      // If results found, show first result on map
      if (results.length > 0) {
        const firstResult = results[0];
        mapService.setView(firstResult.lat, firstResult.lng, 13);
        
        // Add marker for search result
        mapService.addMarker(firstResult.lat, firstResult.lng, {
          popup: `<strong>${firstResult.name}</strong><br/>${firstResult.address}`,
          title: firstResult.name
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await mapService.getCurrentLocation();
      setCurrentLocation(location);
      
      // Set map view to current location
      mapService.setView(location.lat, location.lng, 15);
      
      // Add marker for current location
      mapService.addMarker(location.lat, location.lng, {
        popup: '📍 Your Current Location',
        title: 'Current Location'
      });

      // Get address for current location
      try {
        const address = await mapService.reverseGeocode(location.lat, location.lng);
        if (address) {
          console.log('Current address:', address.address);
        }
      } catch (error) {
        console.error('Failed to get address:', error);
      }

    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('Unable to get your location. Please make sure location services are enabled.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (result) => {
    mapService.setView(result.lat, result.lng, 15);
    mapService.clearMarkers();
    mapService.addMarker(result.lat, result.lng, {
      popup: `<strong>${result.name}</strong><br/>${result.address}`,
      title: result.name
    });
    
    setSearchQuery(result.name);
    setShowSuggestions(false);
    
    if (onLocationSelect) {
      onLocationSelect(result);
    }
  };

  // Get suggested Kerala locations
  const getSuggestedLocations = () => {
    return mapService.getKeralaSuggestedLocations();
  };

  return (
    <div className={`map-component ${className}`}>
      {/* Search Controls */}
      {showSearch && (
        <div className="mb-4 space-y-3">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search locations in India (e.g., 'Thiruvananthapuram', 'Kochi Market')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </form>

          {/* Quick Location Buttons */}
          <div className="flex flex-wrap gap-2">
            {getSuggestedLocations().slice(0, 5).map((location, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(location)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                📍 {location.name}
              </button>
            ))}
          </div>

          {/* Search Results */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionSelect(result)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-600 truncate">{result.address}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          style={{ height }}
          className="w-full rounded-lg border border-gray-300 bg-gray-100"
        />

        {/* Map Controls */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Current Location Button */}
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 disabled:opacity-50"
              title="Get Current Location"
            >
              {isLoadingLocation ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              ) : (
                <Locate className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* Layers Button (Future enhancement) */}
            <button
              onClick={() => {
                // Future: Toggle satellite/terrain view
                console.log('Layer toggle - Future enhancement');
              }}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50"
              title="Map Layers"
            >
              <Layers className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {!mapReady && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Info */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        🗺️ Powered by OpenStreetMap - Free and Open Source Mapping
        {currentLocation && (
          <span className="block mt-1">
            📍 Current: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </span>
        )}
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default MapComponent;