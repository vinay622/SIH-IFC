import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

class OpenStreetMapService {
  constructor() {
    this.map = null;
    this.markers = [];
    this.defaultCenter = [10.8505, 76.2711]; // Kerala, India coordinates
  }

  // Initialize map with OpenStreetMap tiles
  initializeMap(containerId, center = this.defaultCenter, zoom = 10) {
    try {
      // Remove existing map if it exists
      if (this.map) {
        this.map.remove();
      }

      // Create new map
      this.map = L.map(containerId, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: true
      });

      // Add OpenStreetMap tile layer (completely free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 3
      }).addTo(this.map);

      console.log('✅ OpenStreetMap initialized successfully');
      return this.map;
    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
      throw error;
    }
  }

  // Add marker to map
  addMarker(lat, lng, options = {}) {
    if (!this.map) {
      console.error('Map not initialized');
      return null;
    }

    try {
      const markerOptions = {
        title: options.title || '',
        ...options.markerOptions
      };

      const marker = L.marker([lat, lng], markerOptions).addTo(this.map);

      // Add popup if provided
      if (options.popup) {
        marker.bindPopup(options.popup);
      }

      // Add tooltip if provided
      if (options.tooltip) {
        marker.bindTooltip(options.tooltip);
      }

      this.markers.push(marker);
      return marker;
    } catch (error) {
      console.error('Failed to add marker:', error);
      return null;
    }
  }

  // Search location using Nominatim (OpenStreetMap's free geocoding service)
  async searchLocation(query, options = {}) {
    try {
      const params = new URLSearchParams({
        format: 'json',
        q: query,
        countrycodes: options.countryCode || 'in', // Default to India
        limit: options.limit || 5,
        addressdetails: 1
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            'User-Agent': 'IFC-Farmers-Club/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.map(item => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        name: item.name || item.display_name.split(',')[0],
        address: item.display_name,
        type: item.type,
        importance: item.importance,
        boundingBox: item.boundingbox
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }

  // Reverse geocoding - get address from coordinates
  async reverseGeocode(lat, lng) {
    try {
      const params = new URLSearchParams({
        format: 'json',
        lat: lat,
        lon: lng,
        addressdetails: 1
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
        {
          headers: {
            'User-Agent': 'IFC-Farmers-Club/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        address: data.display_name,
        name: data.name,
        details: data.address
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Get current user location
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(location);
        },
        (error) => {
          let message = 'Unknown location error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        }
      );
    });
  }

  // Set map view to specific location
  setView(lat, lng, zoom = 13) {
    if (this.map) {
      this.map.setView([lat, lng], zoom);
    }
  }

  // Fit map to show all markers
  fitBounds() {
    if (this.map && this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  // Clear all markers
  clearMarkers() {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  // Add circle marker (useful for farms, fields)
  addCircleMarker(lat, lng, radius = 100, options = {}) {
    if (!this.map) return null;

    const defaultOptions = {
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.3,
      weight: 2
    };

    const circle = L.circle([lat, lng], {
      radius: radius,
      ...defaultOptions,
      ...options
    }).addTo(this.map);

    if (options.popup) {
      circle.bindPopup(options.popup);
    }

    this.markers.push(circle);
    return circle;
  }

  // Add polygon marker (useful for farm boundaries)
  addPolygon(coordinates, options = {}) {
    if (!this.map) return null;

    const defaultOptions = {
      color: '#16a34a',
      fillColor: '#22c55e',
      fillOpacity: 0.2,
      weight: 3
    };

    const polygon = L.polygon(coordinates, {
      ...defaultOptions,
      ...options
    }).addTo(this.map);

    if (options.popup) {
      polygon.bindPopup(options.popup);
    }

    this.markers.push(polygon);
    return polygon;
  }

  // Calculate distance between two points (in kilometers)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI/180);
  }

  // Get map bounds
  getBounds() {
    if (this.map) {
      return this.map.getBounds();
    }
    return null;
  }

  // Event handlers
  onMapClick(callback) {
    if (this.map) {
      this.map.on('click', callback);
    }
  }

  onMarkerClick(marker, callback) {
    if (marker) {
      marker.on('click', callback);
    }
  }

  // Clean up map resources
  destroy() {
    try {
      if (this.map) {
        this.clearMarkers();
        this.map.off(); // Remove all event listeners
        this.map.remove();
        this.map = null;
      }
    } catch (error) {
      console.warn('Error during map cleanup:', error);
      this.map = null; // Reset anyway
    }
  }

  // Get popular Kerala locations for farmers
  getKeralaSuggestedLocations() {
    return [
      { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, type: 'city' },
      { name: 'Kochi', lat: 9.9312, lng: 76.2673, type: 'city' },
      { name: 'Kozhikode', lat: 11.2588, lng: 75.7804, type: 'city' },
      { name: 'Thrissur', lat: 10.5276, lng: 76.2144, type: 'city' },
      { name: 'Kollam', lat: 8.8932, lng: 76.6141, type: 'city' },
      { name: 'Palakkad', lat: 10.7867, lng: 76.6548, type: 'city' },
      { name: 'Alappuzha', lat: 9.4981, lng: 76.3388, type: 'city' },
      { name: 'Kottayam', lat: 9.5916, lng: 76.5222, type: 'city' },
      { name: 'Kannur', lat: 11.8745, lng: 75.3704, type: 'city' },
      { name: 'Wayanad', lat: 11.6854, lng: 76.1320, type: 'district' }
    ];
  }
}

// Create singleton instance
const mapService = new OpenStreetMapService();

export default mapService;