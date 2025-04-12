
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
    <div className="relative w-full h-[500px] bg-green-100 overflow-hidden rounded-lg shadow-lg">
      {/* Simulated Google Maps style display */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full relative overflow-hidden"
        style={{
          background: `url('https://placehold.co/1200x600/e4f2e4/35883A?text=') no-repeat center center`,
          backgroundSize: 'cover'
        }}
      >
        {/* Map overlay with roads and buildings */}
        <div className="absolute inset-0 z-10">
          {/* Main roads */}
          <div className="absolute top-[30%] left-0 right-0 h-3 bg-gray-300"></div>
          <div className="absolute top-[60%] left-0 right-0 h-3 bg-gray-300"></div>
          <div className="absolute left-[25%] top-0 bottom-0 w-3 bg-gray-300"></div>
          <div className="absolute left-[75%] top-0 bottom-0 w-3 bg-gray-300"></div>
          
          {/* Secondary roads */}
          <div className="absolute top-[15%] left-0 right-0 h-1 bg-gray-300"></div>
          <div className="absolute top-[45%] left-0 right-0 h-1 bg-gray-300"></div>
          <div className="absolute top-[75%] left-0 right-0 h-1 bg-gray-300"></div>
          <div className="absolute left-[10%] top-0 bottom-0 w-1 bg-gray-300"></div>
          <div className="absolute left-[40%] top-0 bottom-0 w-1 bg-gray-300"></div>
          <div className="absolute left-[60%] top-0 bottom-0 w-1 bg-gray-300"></div>
          <div className="absolute left-[90%] top-0 bottom-0 w-1 bg-gray-300"></div>
          
          {/* Buildings */}
          <div className="absolute left-[5%] top-[5%] w-[15%] h-[10%] bg-blue-200 border border-blue-300 rounded-sm"></div>
          <div className="absolute left-[30%] top-[5%] w-[10%] h-[8%] bg-blue-100 border border-blue-300 rounded-sm"></div>
          <div className="absolute left-[80%] top-[10%] w-[12%] h-[15%] bg-gray-200 border border-gray-300 rounded-sm"></div>
          <div className="absolute left-[5%] top-[35%] w-[8%] h-[12%] bg-green-200 border border-green-300 rounded-sm"></div>
          <div className="absolute left-[50%] top-[40%] w-[20%] h-[10%] bg-red-100 border border-red-300 rounded-sm"></div>
          <div className="absolute left-[85%] top-[35%] w-[10%] h-[25%] bg-yellow-100 border border-yellow-300 rounded-sm"></div>
          <div className="absolute left-[15%] top-[70%] w-[25%] h-[15%] bg-purple-100 border border-purple-300 rounded-sm"></div>
          <div className="absolute left-[60%] top-[70%] w-[15%] h-[20%] bg-orange-100 border border-orange-300 rounded-sm"></div>
          
          {/* Hospital building - highlighted */}
          <div className="absolute left-[45%] top-[17%] w-[15%] h-[10%] bg-red-100 border-2 border-red-500 rounded-sm flex items-center justify-center">
            <div className="text-red-600 font-bold text-xs">Hospital</div>
          </div>
        </div>
        
        {/* User's location marker */}
        <div 
          ref={userMarkerRef}
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
          <div className="w-12 h-6 bg-white text-blue-600 text-xs font-bold rounded px-1 mt-1 shadow flex items-center justify-center">
            You
          </div>
        </div>
        
        {/* Ambulance marker */}
        <div 
          ref={ambulanceMarkerRef}
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
          <div className="w-20 h-6 bg-white text-red-600 text-xs font-bold rounded px-1 mt-1 shadow flex items-center justify-center">
            Ambulance
          </div>
        </div>
        
        {/* Path from ambulance to user */}
        <svg className="absolute inset-0 z-15 w-full h-full">
          <path
            ref={pathRef}
            d="M80,80 Q150,150 250,180 T400,250" 
            stroke="red"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="5,5"
          />
        </svg>
        
        {/* Map controls (for decoration) */}
        <div className="absolute top-4 right-4 z-30 flex flex-col space-y-2">
          <div className="w-8 h-8 bg-white rounded-sm shadow flex items-center justify-center text-gray-700 cursor-pointer hover:bg-gray-100">+</div>
          <div className="w-8 h-8 bg-white rounded-sm shadow flex items-center justify-center text-gray-700 cursor-pointer hover:bg-gray-100">−</div>
        </div>
        
        <div className="absolute bottom-4 right-4 z-30">
          <div className="bg-white px-2 py-1 rounded shadow text-xs text-gray-700">
            Demo Map View
          </div>
        </div>
      </div>
      
      {/* Emergency info overlay */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-lg z-30 max-w-xs">
        <h3 className="font-bold text-red-600">Emergency Response</h3>
        <p className="text-sm">Ambulance dispatched from City Hospital</p>
        <p className="text-xs text-gray-600">ETA: ~5 minutes</p>
        <div className="mt-2 text-xs bg-green-100 p-1 rounded flex items-center justify-between">
          <span>Live tracking enabled</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
