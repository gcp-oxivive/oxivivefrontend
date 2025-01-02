import React, { useEffect, useState , Suspense} from 'react';
import './Home.css';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { TfiAngleDoubleRight } from 'react-icons/tfi';
import { PiAmbulanceLight } from 'react-icons/pi';
import { BiClinic } from 'react-icons/bi';
import { MdSportsGymnastics } from 'react-icons/md';
import { BsPerson } from 'react-icons/bs';
// Lazy load the SliderComponent and Footer to optimize loading
const SliderComponent = React.lazy(() => import('./SliderComponent'));
const Footer = React.lazy(() => import('./Footer'));


const API_KEY = "AIzaSyCMsV0WQ7v8ra-2e7qRXVnDr7j0vOoOcWM";

declare global {
  interface Window {
    google: any;
  }
}

const Home: React.FC = () => {
  const router = useRouter();
  const [location, setLocation] = useState<string>('Fetching location...');
  const [oxiId, setOxiId] = useState<string>('Unknown');
  const [showClinicEducate, setShowClinicEducate] = useState<boolean>(false);
  const [showWheelEducate, setShowWheelEducate] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOxiImagesClicked, setIsOxiImagesClicked] = useState(false); // State for handling the click on oxi-images-section
  const [notificationCount, setNotificationCount] = useState(0);
  
  
  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window !== 'undefined') {
      const storedOxiId = localStorage.getItem('oxi_id') || 'Unknown';
      setOxiId(storedOxiId);
    }
  }, []); 

  const handleServiceClick = (service: string) => {
    const location = currentAddress || 'Unknown'; // Use the current address if available
    const selectedService = service; // Pass the clicked service explicitly
    
    // Navigate to the ClinicSearch page with the proper query parameters
    router.push(`/DashBoard/ClinicSearch?service=${encodeURIComponent(selectedService)}&location=${encodeURIComponent(location)}&oxi_id=${oxiId}`);
  };
  
  const clearLocation = () => {
    setLocation(''); // Clear the displayed location text
    setQuery(''); // Clear the search query
    setCurrentAddress(null); // Reset the current address
  };
  
  

  const handleClinicClick = () => {
    setShowClinicEducate(true);
    setShowWheelEducate(false);
  
    // Scroll to the clinic educate section
    document.getElementById("oxi-educate-clinic")?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  const handleWheelClick = () => {
    setShowWheelEducate(true);
    setShowClinicEducate(false);
  
    // Scroll to the wheel educate section
    document.getElementById("oxi-educate-wheel")?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  

  useEffect(() => {
    // Non-blocking geolocation fetching
    const geoSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const location = { lat: latitude, lng: longitude };
      setCurrentLocation(location);
      fetchAddress(location);
    };

    const geoError = (error: GeolocationPositionError) => {
      console.error('Error obtaining location:', error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { enableHighAccuracy: true });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    if (window.google) return;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);
  };

  const fetchAddress = async (location: google.maps.LatLngLiteral) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=AIzaSyCMsV0WQ7v8ra-2e7qRXVnDr7j0vOoOcWM`);
    const data = await response.json();
    if (data.status === 'OK') {
      const address = data.results[0].formatted_address;
      setCurrentAddress(address);
    } else {
      console.error('Error fetching address:', data.status);
    }
  };

  const fetchSuggestions = (searchQuery: string) => {
    if (!window.google) {
      console.error('Google Maps library not loaded yet.');
      return;
    }

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      {
        input: searchQuery,
        location: new window.google.maps.LatLng(16.8, 81.5),
        radius: 30000,
        types: ['geocode'],
      },
      (predictions: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        } else {
          console.error('Error fetching predictions:', status);
        }
      }
    );
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value) fetchSuggestions(value);
    else setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    const oxiId = localStorage.getItem('oxi_id') || 'Unknown';
    router.push(
      `/DashBoard/ClinicSearch?location=${encodeURIComponent(
        suggestion.description
      )}&oxi_id=${oxiId}`
    );
  };

  const handleOxiImagesClick = () => {
    setIsOxiImagesClicked(true);
  };

  return (
    <div className="home-container" style={{ height: isOxiImagesClicked ? 'auto' : '100vh' }}>

<div className="fixed-header">
        <div className="search-container">
          <CiSearch size={24} className="search-icon" />
          <input
            type="text"
            placeholder="Search for a location"
            value={query || (currentAddress || '')}
            onFocus={() => setQuery('')} 
            onChange={handleInputChange}
            
            className="search-input"
          />

{query && (
      <button 
        onClick={clearLocation} 
        className="clear-button" 
        aria-label="Clear input"
      >
        ✕
      </button>
    )}
          <div className="notifications-container">
            <IoNotificationsOutline 
              size={26} 
              className="notifications-icon" 
            />
            {notificationCount > 0 && (
              <div className="notifications-badge">
                {notificationCount}
              </div>
            )}
          </div>
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map((suggestion: any) => (
                <div
                  key={suggestion.place_id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FaMapMarkerAlt size={16} color="red" />
                  <span className="suggestion-text">{suggestion.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="scrollable-content" >
      {/* Promotion Slider */}
      <Suspense fallback={<div>Loading Slider...</div>}>
          <SliderComponent />
        </Suspense>

      {/* Service Section */}
      <div className="service-section">
        <div className="section-header">
          <h1 className="service">Services</h1>
          <button className="view-all-button">View all</button>
          <TfiAngleDoubleRight size={14} className="arrow-icon" />
        </div>
      </div>

      <div className="services-icon-section">
        <div className="icon-row">
          <div className="service-icon-container" onClick={() => handleServiceClick('Oxi Clinic')}>
            <BiClinic size={40} className="service-icon" />
            <span className="service-text-clinic">Oxi Clinic</span>
          </div>
          
          <div className="service-icon-container" onClick={() => handleServiceClick('Oxi Clinic')}>
            <PiAmbulanceLight size={40} className="service-icon" />
            <span className="service-text-wheel">Oxi Wheel</span>
          </div>
        
          <div className="service-icon-container-gym" onClick={() => handleServiceClick('Oxi Wheel')}>
            <MdSportsGymnastics size={40} className="service-icon" />
            <span className="service-text-gym">Oxi Gym</span>
          </div>
        </div>
      </div>

      <div className='explore-container'>
        <p className='images-above-section'> Explore</p>
      </div>

      {/* Oxi images */}
      <div className="oxi-images-section" onClick={handleOxiImagesClick}>
        <img src="/images/oxiclinic.png" alt="Oxi Clinic" className="oxi-image"  onClick={handleClinicClick} loading="lazy" />
        <img src="/images/oxiwheel.png" alt="Oxi Wheel" className="oxi-image"  onClick={handleWheelClick} loading="lazy" />
      </div>


    {showClinicEducate && (
        <div id="oxi-educate-clinic" className="oxi-educate-section">
          <p className='how-to-book'>How to book an Oxi Clinic Service</p>
          <ol className="educate-list">
            <li>Click on the Oxi Clinic image to start.</li>
            <li>Search for a location or confirm your current location.</li>
            <li>Select the clinic from the map based on your chosen location.</li>
            <li>Choose a convenient date and time for your appointment.</li>
            <li>Complete the payment to confirm your booking.</li>
            <li>View your booked service in the My Bookings section.</li>
          </ol>
        </div>
      )}

      {showWheelEducate && (
        <div id="oxi-educate-wheel" className="oxi-educate-section">
          <h2>How to book an Oxi Wheel Service</h2>
          <ol className="educate-list">
            <li>Click on the Oxi Wheel image to start.</li>
            <li>Search for a location or confirm your current location.</li>
            <li>Select the Oxi Wheel service from the map based on your chosen location.</li>
            <li>Choose a convenient date and time for your appointment.</li>
            <li>Complete the payment to confirm your booking.</li>
            <li>View your booked service in the My Bookings section.</li>
          </ol>
        </div>
      )}
        </div>
        <Suspense fallback={<div>Loading Footer...</div>}>

      {/* Footer Section */}
      <Footer />
      </Suspense>
    </div>
  );
};

export default Home;