import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import useGeolocation from "../../hooks/useGeolocation";
import { FaMapMarkerAlt, FaHome, FaLocationArrow, FaExpand } from "react-icons/fa";

// Need to fix Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function PropertyMap({ listings = [], height = "500px", centerListing = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  
  const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
    latitude: 27.7172, // Default to Kathmandu if geolocation is not available
    longitude: 85.3240
  });
  
  const location = useGeolocation();
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(false);

  // Initialize map on component mount
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Default center (will be overridden if centerListing or user position is available)
      const defaultCenter = [userPosition.latitude, userPosition.longitude];
      
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, 13);
      
      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
      
      // Create a layer for markers
      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      
      setMapInitialized(true);
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add property markers when listings change or map is initialized
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current) return;
    
    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
    
    // If we have a specific listing to center on
    if (centerListing) {
      try {
        // This is a simplistic approach - in a real app, you'd likely geocode the address
        // For now, we're assuming you have lat/lng in your listing or can derive them
        const lat = centerListing.latitude || 27.7172;
        const lng = centerListing.longitude || 85.3240;
        
        // Center the map on this listing
        mapInstanceRef.current.setView([lat, lng], 15);
        
        // Add a marker for this listing
        const marker = L.marker([lat, lng])
          .addTo(markersLayerRef.current)
          .bindPopup(`
            <div class="popup-content">
              <h3 class="text-lg font-bold">${centerListing.name}</h3>
              <p>${centerListing.address}</p>
              <p class="font-bold mt-2">$${centerListing.price?.toLocaleString()}</p>
            </div>
          `);
        
        // Open the popup automatically
        marker.openPopup();
      } catch (error) {
        console.error("Error centering on listing:", error);
      }
    } 
    // Otherwise show all listings if available
    else if (listings.length > 0) {
      // Create bounds to fit all markers
      const bounds = L.latLngBounds();
      
      // Add markers for all listings
      listings.forEach(listing => {
        // In a real app, you would have actual coordinates
        // Here we're simulating by using random coordinates near the user location
        const lat = userPosition.latitude + (Math.random() - 0.5) * 0.05;
        const lng = userPosition.longitude + (Math.random() - 0.5) * 0.05;
        
        const marker = L.marker([lat, lng])
          .addTo(markersLayerRef.current)
          .bindPopup(`
            <div class="popup-content">
              <h3 class="text-lg font-bold">${listing.name}</h3>
              <p>${listing.address}</p>
              <p class="font-bold mt-2">$${listing.price?.toLocaleString()}</p>
            </div>
          `);
        
        // Extend bounds to include this marker
        bounds.extend([lat, lng]);
      });
      
      // Fit map to bounds if we have listings
      if (listings.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15
        });
      }
    }
  }, [listings, centerListing, mapInitialized]);

  // Update user position marker when location changes
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current) return;
    
    // Only proceed if we're showing user location and have valid coordinates
    if (showUserLocation && location.latitude && location.longitude) {
      // Update stored user position
      setUserPosition({
        latitude: location.latitude,
        longitude: location.longitude
      });
      
      // Remove existing user marker if it exists
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      
      // Create a custom icon for user location
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      // Add new user marker
      userMarkerRef.current = L.marker([location.latitude, location.longitude], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);
      
      // If we're only showing user location (no listings), center on user
      if (listings.length === 0 && !centerListing) {
        mapInstanceRef.current.setView([location.latitude, location.longitude], 15);
      }
    }
  }, [location, showUserLocation, mapInitialized]);

  // Toggle user location visibility
  const handleToggleUserLocation = () => {
    setShowUserLocation(!showUserLocation);
  };

  // Center map on user location
  const handleCenterOnUser = () => {
    if (!mapInstanceRef.current) return;
    
    if (location.latitude && location.longitude) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 15);
    }
  };

  // Reset map view to show all markers
  const handleResetView = () => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    
    // Get all markers
    const allMarkers = [];
    markersLayerRef.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        allMarkers.push(layer.getLatLng());
      }
    });
    
    // If we have markers, fit bounds
    if (allMarkers.length > 0) {
      const bounds = L.latLngBounds(allMarkers);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-md border border-gray-200">
      <div 
        ref={mapRef} 
        className="z-0 w-full rounded-xl" 
        style={{ height: height }}
      ></div>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button 
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          onClick={handleToggleUserLocation}
          title={showUserLocation ? "Hide my location" : "Show my location"}
        >
          <FaLocationArrow className={`h-5 w-5 ${showUserLocation ? 'text-blue-500' : 'text-gray-500'}`} />
        </button>
        
        <button 
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          onClick={handleCenterOnUser}
          title="Center on my location"
        >
          <FaMapMarkerAlt className="h-5 w-5 text-gray-500" />
        </button>
        
        <button 
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          onClick={handleResetView}
          title="Show all properties"
        >
          <FaExpand className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg text-sm">
        <div className="flex items-center mb-2">
          <FaHome className="text-blue-500 mr-2" />
          <span>Properties</span>
        </div>
        {showUserLocation && (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Your Location</span>
          </div>
        )}
      </div>
    </div>
  );
}