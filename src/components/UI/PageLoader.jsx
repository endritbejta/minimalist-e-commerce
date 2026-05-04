function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      <div className="w-64 h-[1px] bg-gray-100 relative overflow-hidden mb-4">
        {/* The Filling Line */}
        <div className="absolute inset-0 bg-black animate-loading-bar origin-left"></div>
      </div>
      
      {/* Branding / Text */}
      <div className="flex flex-col items-center space-y-1">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-900">
          E-Commerce
        </span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-bold">
          Loading Experiences
        </span>
      </div>
    </div>
  );
}

export default PageLoader;
