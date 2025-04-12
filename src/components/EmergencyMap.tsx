
import React, { useEffect, useRef } from 'react';

const EmergencyMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<HTMLDivElement>(null);
  const ambulanceMarkerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Simulate map loading and ambulance movement
    if (!mapContainerRef.current || !userMarkerRef.current || !ambulanceMarkerRef.current || !pathRef.current) return;
    
    // Position the user marker in the center
    const userMarker = userMarkerRef.current;
    userMarker.style.left = '50%';
    userMarker.style.top = '50%';

    // Create ambulance path animation
    const ambulanceMarker = ambulanceMarkerRef.current;
    const path = pathRef.current;
    
    // Get path length for animation
    const pathLength = path.getTotalLength();
    
    // Set up the path animation
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;
    
    // Animate the path drawing
    path.style.transition = 'stroke-dashoffset 8s ease-in-out';
    path.style.strokeDashoffset = '0';
    
    // Position ambulance at the start of the path
    const startPoint = path.getPointAtLength(0);
    ambulanceMarker.style.left = `${startPoint.x}px`;
    ambulanceMarker.style.top = `${startPoint.y}px`;
    
    // Animate ambulance along the path
    const animateAmbulance = () => {
      let distance = 0;
      const animationSpeed = 8000; // 8 seconds
      const startTime = Date.now();
      
      const moveAmbulance = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationSpeed, 1);
        distance = progress * pathLength;
        
        if (progress < 1) {
          const point = path.getPointAtLength(distance);
          ambulanceMarker.style.left = `${point.x}px`;
          ambulanceMarker.style.top = `${point.y}px`;
          requestAnimationFrame(moveAmbulance);
        } else {
          // Ambulance arrived
          const userPos = {
            x: parseFloat(userMarker.style.left),
            y: parseFloat(userMarker.style.top)
          };
          ambulanceMarker.style.left = `${userPos.x}px`;
          ambulanceMarker.style.top = `${userPos.y}px`;
        }
      };
      
      requestAnimationFrame(moveAmbulance);
    };
    
    // Start animation after a brief delay
    setTimeout(animateAmbulance, 500);
    
    // Simulate map controls and interaction
    const handleMapClick = (e: MouseEvent) => {
      // Only for demo purposes - interactions would normally connect to a real maps API
      const rect = mapContainerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create a temporary "ping" effect
      const ping = document.createElement('div');
      ping.className = 'absolute w-4 h-4 bg-blue-500 rounded-full animate-ping';
      ping.style.left = `${x}px`;
      ping.style.top = `${y}px`;
      mapContainerRef.current!.appendChild(ping);
      
      // Remove after animation
      setTimeout(() => {
        ping.remove();
      }, 1000);
    };
    
    mapContainerRef.current.addEventListener('click', handleMapClick);
    
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.removeEventListener('click', handleMapClick);
      }
    };
  }, []);
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-lg">
      {/* Google Maps style display */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full relative overflow-hidden"
        style={{
          background: `url('public/lovable-uploads/979eade0-1a0d-4ae0-83b8-e9bd4f3ff50e.png') no-repeat center center`,
          backgroundSize: 'cover'
        }}
      >
        {/* Semi-transparent overlay to enhance map details */}
        <div className="absolute inset-0 bg-white/10 z-10"></div>
        
        {/* Map overlay with roads and buildings */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Main roads - more prominent and Google Maps style */}
          <div className="absolute top-[30%] left-0 right-0 h-3 bg-white/70 shadow-sm"></div>
          <div className="absolute top-[60%] left-0 right-0 h-3 bg-white/70 shadow-sm"></div>
          <div className="absolute left-[25%] top-0 bottom-0 w-3 bg-white/70 shadow-sm"></div>
          <div className="absolute left-[75%] top-0 bottom-0 w-3 bg-white/70 shadow-sm"></div>
          
          {/* Highway style roads with lane markings */}
          <div className="absolute top-[30%] left-0 right-0 h-[2px] bg-yellow-400/80"></div>
          <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-yellow-400/80"></div>
          
          {/* Secondary roads */}
          <div className="absolute top-[15%] left-0 right-0 h-2 bg-white/60"></div>
          <div className="absolute top-[45%] left-0 right-0 h-2 bg-white/60"></div>
          <div className="absolute top-[75%] left-0 right-0 h-2 bg-white/60"></div>
          <div className="absolute left-[10%] top-0 bottom-0 w-2 bg-white/60"></div>
          <div className="absolute left-[40%] top-0 bottom-0 w-2 bg-white/60"></div>
          <div className="absolute left-[60%] top-0 bottom-0 w-2 bg-white/60"></div>
          <div className="absolute left-[90%] top-0 bottom-0 w-2 bg-white/60"></div>
          
          {/* Minor roads / streets */}
          <div className="absolute top-[10%] left-0 right-0 h-1 bg-white/40"></div>
          <div className="absolute top-[20%] left-0 right-0 h-1 bg-white/40"></div>
          <div className="absolute top-[40%] left-0 right-0 h-1 bg-white/40"></div>
          <div className="absolute top-[50%] left-0 right-0 h-1 bg-white/40"></div>
          <div className="absolute top-[70%] left-0 right-0 h-1 bg-white/40"></div>
          <div className="absolute top-[85%] left-0 right-0 h-1 bg-white/40"></div>
          <div className="absolute left-[5%] top-0 bottom-0 w-1 bg-white/40"></div>
          <div className="absolute left-[15%] top-0 bottom-0 w-1 bg-white/40"></div>
          <div className="absolute left-[35%] top-0 bottom-0 w-1 bg-white/40"></div>
          <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-white/40"></div>
          <div className="absolute left-[65%] top-0 bottom-0 w-1 bg-white/40"></div>
          <div className="absolute left-[80%] top-0 bottom-0 w-1 bg-white/40"></div>
          <div className="absolute left-[95%] top-0 bottom-0 w-1 bg-white/40"></div>
          
          {/* Buildings - more realistic and Google Maps style */}
          {/* Commercial district */}
          <div className="absolute left-[5%] top-[5%] w-[15%] h-[10%] bg-gray-800/60 border border-gray-700/80 rounded-sm shadow-md"></div>
          <div className="absolute left-[7%] top-[6%] w-[10%] h-[7%] bg-gray-700/80 border border-gray-600/80 rounded-sm shadow-md transform -rotate-3"></div>
          <div className="absolute left-[30%] top-[5%] w-[10%] h-[8%] bg-gray-600/70 border border-gray-500/80 rounded-sm shadow-md"></div>
          <div className="absolute left-[80%] top-[10%] w-[12%] h-[15%] bg-gray-700/70 border border-gray-600/80 rounded-sm shadow-md"></div>
          
          {/* Parks and green spaces */}
          <div className="absolute left-[5%] top-[35%] w-[8%] h-[12%] bg-green-600/40 border border-green-500/30 rounded-md"></div>
          <div className="absolute left-[6%] top-[36%] w-[1%] h-[1%] bg-green-700/50 rounded-full"></div>
          <div className="absolute left-[8%] top-[39%] w-[1%] h-[1%] bg-green-700/50 rounded-full"></div>
          <div className="absolute left-[10%] top-[41%] w-[1%] h-[1%] bg-green-700/50 rounded-full"></div>
          <div className="absolute left-[70%] top-[48%] w-[18%] h-[10%] bg-green-600/40 border border-green-500/30 rounded-md"></div>
          <div className="absolute left-[75%] top-[50%] w-[1%] h-[1%] bg-green-700/50 rounded-full"></div>
          <div className="absolute left-[80%] top-[52%] w-[1%] h-[1%] bg-green-700/50 rounded-full"></div>
          
          {/* Residential areas */}
          <div className="absolute left-[50%] top-[40%] w-[10%] h-[6%] bg-orange-200/30 border border-orange-300/20 rounded-sm shadow-sm"></div>
          <div className="absolute left-[51%] top-[41%] w-[7%] h-[4%] bg-orange-300/20 rounded-sm"></div>
          <div className="absolute left-[85%] top-[35%] w-[10%] h-[25%] bg-orange-200/30 border border-orange-300/20 rounded-sm shadow-sm"></div>
          <div className="absolute left-[15%] top-[70%] w-[25%] h-[15%] bg-orange-200/30 border border-orange-300/20 rounded-sm shadow-sm"></div>
          <div className="absolute left-[18%] top-[72%] w-[5%] h-[5%] bg-orange-300/20 rounded-sm"></div>
          <div className="absolute left-[25%] top-[75%] w-[5%] h-[5%] bg-orange-300/20 rounded-sm"></div>
          
          {/* Shopping mall */}
          <div className="absolute left-[60%] top-[70%] w-[15%] h-[20%] bg-blue-300/30 border border-blue-200/30 rounded-sm shadow-md"></div>
          <div className="absolute left-[62%] top-[72%] w-[11%] h-[16%] bg-blue-200/20 rounded-sm"></div>
          
          {/* Water features - rivers/lakes */}
          <div className="absolute left-[20%] top-[20%] w-[15%] h-[8%] bg-blue-500/30 border border-blue-400/20 rounded-full"></div>
          <div className="absolute left-[18%] top-[18%] w-[20%] h-[12%] bg-blue-500/10 border border-blue-400/10 rounded-full"></div>
          
          {/* Hospital building - highlighted */}
          <div className="absolute left-[45%] top-[17%] w-[15%] h-[10%] bg-red-100/50 border-2 border-red-500/70 rounded-sm flex items-center justify-center shadow-lg">
            <div className="text-red-600 font-bold text-xs bg-white/90 px-2 py-1 rounded">Hospital</div>
          </div>
          
          {/* College/University Campus */}
          <div className="absolute left-[70%] top-[15%] w-[20%] h-[15%] bg-blue-100/30 border border-blue-200/40 rounded-md">
            <div className="absolute left-[5%] top-[15%] w-[40%] h-[30%] bg-blue-200/40 border border-blue-300/30 rounded-sm"></div>
            <div className="absolute left-[55%] top-[15%] w-[40%] h-[30%] bg-blue-200/40 border border-blue-300/30 rounded-sm"></div>
            <div className="absolute left-[30%] top-[60%] w-[40%] h-[30%] bg-blue-200/40 border border-blue-300/30 rounded-sm"></div>
          </div>
          
          {/* Traffic circle/roundabout */}
          <div className="absolute left-[35%] top-[60%] w-[10%] h-[10%] rounded-full border-4 border-white/60">
            <div className="absolute inset-[15%] rounded-full bg-green-600/40"></div>
          </div>
        </div>
        
        {/* User's location marker - improved Google Maps style */}
        <div 
          ref={userMarkerRef}
          className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-blue-600"></div>
          </div>
          <div className="w-14 h-6 bg-white text-blue-600 text-xs font-bold rounded px-1 mt-2 shadow flex items-center justify-center">
            You
          </div>
          
          {/* User location accuracy circle */}
          <div className="absolute w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 -top-8 -left-8 animate-pulse"></div>
        </div>
        
        {/* Ambulance marker - improved with Google Maps style */}
        <div 
          ref={ambulanceMarkerRef}
          className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="w-7 h-7 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              +
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-red-600"></div>
          </div>
          <div className="w-20 h-6 bg-white text-red-600 text-xs font-bold rounded px-1 mt-2 shadow flex items-center justify-center">
            Ambulance
          </div>
        </div>
        
        {/* Path from ambulance to user - more Google Maps style */}
        <svg className="absolute inset-0 z-30 w-full h-full">
          {/* Path shadow for depth */}
          <path
            d="M80,80 Q150,150 250,180 T400,250" 
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="1,0"
            filter="blur(1px)"
          />
          {/* Main path */}
          <path
            ref={pathRef}
            d="M80,80 Q150,150 250,180 T400,250" 
            stroke="rgba(66, 133, 244, 0.9)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Map controls (Google style) */}
        <div className="absolute top-4 right-4 z-40 flex flex-col space-y-2 rounded-md overflow-hidden shadow-lg">
          <div className="w-8 h-8 bg-white flex items-center justify-center text-gray-700 cursor-pointer hover:bg-gray-100 border-b border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </div>
          <div className="w-8 h-8 bg-white flex items-center justify-center text-gray-700 cursor-pointer hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
            </svg>
          </div>
        </div>
        
        {/* Google Maps style navigation/location buttons */}
        <div className="absolute bottom-6 right-4 z-40 flex flex-col space-y-2">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 cursor-pointer hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
          </div>
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 cursor-pointer hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 12v.01"></path>
              <path d="M19.071 4.929C17.011 2.869 14.159 2 12 2c-2.159 0-5.011.869-7.071 2.929C2.869 6.989 2 9.841 2 12c0 2.159.869 5.011 2.929 7.071C6.989 21.131 9.841 22 12 22c2.159 0 5.011-.869 7.071-2.929C21.131 17.011 22 14.159 22 12c0-2.159-.869-5.011-2.929-7.071z"></path>
              <path d="M4.929 4.929c-3.905 3.905-3.905 10.237 0 14.142"></path>
              <path d="M19.071 19.071c3.905-3.905 3.905-10.237 0-14.142"></path>
            </svg>
          </div>
        </div>
        
        {/* Google Maps zoom slider */}
        <div className="absolute top-20 right-4 z-40 bg-white rounded-md shadow-lg overflow-hidden">
          <div className="w-8 h-36 flex flex-col">
            <div className="h-1/2 flex items-center justify-center cursor-pointer hover:bg-gray-100 border-b border-gray-200">
              <div className="h-16 w-1 bg-gray-300 rounded-full relative">
                <div className="absolute bottom-0 w-1 h-1/2 bg-blue-500 rounded-full"></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -left-1 w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 z-40">
          <div className="bg-white/90 px-3 py-1 rounded shadow-md text-xs text-gray-700 font-medium">
            Google Maps
          </div>
        </div>
      </div>
      
      {/* Emergency info overlay - Google Maps style */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-lg z-40 max-w-xs">
        <h3 className="font-bold text-red-600">Emergency Response</h3>
        <p className="text-sm">Ambulance dispatched from City Hospital</p>
        <p className="text-xs text-gray-600">ETA: ~5 minutes</p>
        <div className="mt-2 text-xs bg-blue-50 p-1 rounded flex items-center justify-between">
          <span>Live tracking enabled</span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        </div>
      </div>
      
      {/* Google Maps style info card */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md z-40 overflow-hidden max-w-xs">
        <div className="px-3 py-2 bg-blue-50 flex items-center justify-between border-b border-gray-200">
          <span className="font-medium text-sm">Emergency Route</span>
          <span className="text-sm text-blue-600">1.2 mi</span>
        </div>
        <div className="p-3">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-sm">Your location</span>
          </div>
          <div className="ml-1 h-6 border-l border-dashed border-gray-400"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <span className="text-sm">City Hospital</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
