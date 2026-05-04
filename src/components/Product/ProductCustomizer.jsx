import React, { useState } from 'react';
import { IoClose, IoCheckmarkCircle, IoSyncOutline } from 'react-icons/io5';
import PopUpModal from '../UI/PopUpModal';

const POSITIONS = [
  { id: 'front-left', label: 'Front Left', side: 'front' },
  { id: 'front-center', label: 'Front Center', side: 'front' },
  { id: 'front-right', label: 'Front Right', side: 'front' },
];

const EMBLEMS = [
  { id: 'emblem-1', name: 'Legacy Badge', path: '/assets/emblems/old-emblem-1.png' },
  { id: 'emblem-2', name: 'Heritage Crest', path: '/assets/emblems/old-emblem-2.png' },
  { id: 'emblem-3', name: 'Classic Icon', path: '/assets/emblems/old-emblem-3.png' },
  { id: 'emblem-4', name: 'Signature Logo', path: '/assets/emblems/old-emblem.png' },
];

const BACK_SIZES = [
  { id: 'small', label: 'Small', scale: '14%' },
  { id: 'medium', label: 'Medium', scale: '26%' },
  { id: 'big', label: 'Big', scale: '40%' },
];

const BACK_ALIGNMENTS = [
  { id: 'top', label: 'Top', top: '24%' },
  { id: 'center', label: 'Center', top: '38%' },
  { id: 'bottom', label: 'Bottom', top: '60%' },
];

function ProductCustomizer({ isOpen, onClose, onApply, currentCustomization }) {
  const [selectedEmblem, setSelectedEmblem] = useState(currentCustomization?.emblem || EMBLEMS[0]);
  const [selectedPosition, setSelectedPosition] = useState(currentCustomization?.position || POSITIONS[1].id);
  const [includeFrontEmblem, setIncludeFrontEmblem] = useState(currentCustomization?.includeFrontEmblem !== undefined ? currentCustomization?.includeFrontEmblem : true);
  const [includeBackEmblem, setIncludeBackEmblem] = useState(currentCustomization?.includeBackEmblem || false);
  const [backEmblemSize, setBackEmblemSize] = useState(currentCustomization?.backEmblemSize || 'medium');
  const [backEmblemAlignment, setBackEmblemAlignment] = useState(currentCustomization?.backEmblemAlignment || 'center');
  const [viewMode, setViewMode] = useState('front');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      emblem: selectedEmblem,
      position: selectedPosition,
      includeFrontEmblem,
      includeBackEmblem,
      backEmblemSize,
      backEmblemAlignment
    });
    onClose();
  };

  const getPreviewStyles = (pos, isBack = false) => {
    if (isBack) {
      const size = BACK_SIZES.find(s => s.id === backEmblemSize)?.scale || '26%';
      let topPos = BACK_ALIGNMENTS.find(a => a.id === backEmblemAlignment)?.top || '38%';
      
      if (backEmblemAlignment === 'top') {
        if (backEmblemSize === 'big') topPos = '32%';
        else if (backEmblemSize === 'medium') topPos = '28%';
        else topPos = '24%';
      }

      return { top: topPos, left: '50%', transform: 'translate(-50%, -50%)', width: size, height: size };
    }
    
    switch (pos) {
      case 'front-left': return { top: '35%', left: '65%', transform: 'translate(-50%, -50%)', width: '16%', height: '16%' };
      case 'front-center': return { top: '35%', left: '50%', transform: 'translate(-50%, -50%)', width: '16%', height: '16%' };
      case 'front-right': return { top: '35%', left: '35%', transform: 'translate(-50%, -50%)', width: '16%', height: '16%' };
      default: return { top: '35%', left: '50%', transform: 'translate(-50%, -50%)', width: '16%', height: '16%' };
    }
  };

  return (
    <PopUpModal isOpen={isOpen} onClose={onClose} className="w-full max-w-5xl bg-white p-0">
        {/* Fixed Header */}
        <div className="p-4 md:p-6 border-b flex items-center justify-between bg-white z-20">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Placement Options</h2>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Customize your layout</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close customizer">
            <IoClose size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto md:overflow-y-hidden min-h-0">
          <div className="flex flex-col md:flex-row h-full md:overflow-hidden">
            {/* Left Side: Visual Preview (Sticky on desktop) */}
            <div className="w-full md:w-3/5 bg-gray-50 p-4 md:p-6 md:pt-2 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r">

              {/* Shirt Preview Area - Capped height so it doesn't push the switcher buttons off screen */}
              <div className="relative w-full max-w-[240px] md:max-w-[280px] aspect-[4/5] flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img 
                    src={viewMode === 'front' ? '/assets/tshirt_mockup_front.png' : '/assets/tshirt_mockup_back.png'} 
                    alt="T-Shirt Mockup" 
                    className="w-full h-full object-contain transition-opacity duration-300"
                  />
                  
                  {/* Overlay Emblem - Front Side */}
                  {selectedEmblem && viewMode === 'front' && includeFrontEmblem && (
                    <div 
                      className="absolute z-10 flex items-center justify-center transition-all duration-500 ease-in-out"
                      style={getPreviewStyles(selectedPosition)}
                    >
                      <img 
                        src={selectedEmblem.path} 
                        alt="Emblem Preview"
                        className="w-full h-full object-contain animate-fadeIn"
                      />
                    </div>
                  )}

                  {/* Overlay Emblem - Back Side */}
                  {selectedEmblem && viewMode === 'back' && includeBackEmblem && (
                    <div 
                      className="absolute z-10 flex items-center justify-center transition-all duration-500 ease-in-out"
                      style={getPreviewStyles('back', true)}
                    >
                      <img 
                        src={selectedEmblem.path} 
                        alt="Emblem Preview"
                        className="w-full h-full object-contain animate-fadeIn"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* View Switcher Controls */}
              <div className="mt-4 flex bg-gray-200/50 p-1 rounded-full backdrop-blur-sm">
                <button 
                  onClick={() => setViewMode('front')}
                  className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'front' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Front
                </button>
                <button 
                  onClick={() => setViewMode('back')}
                  className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'back' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Back
                </button>
              </div>
            </div>

            {/* Right Side: Placement Controls (Scrollable on desktop) */}
            <div className="w-full md:w-2/5 p-6 space-y-8 bg-white md:overflow-y-scroll h-full max-h-[60vh]">
              {/* STEP 1: Emblem Selection */}
              <div className="w-full space-y-3 pb-8 border-b">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Your Emblem</h3>
                <div className="flex flex-wrap justify-start gap-2">
                  {EMBLEMS.map((emblem) => (
                    <button
                      key={emblem.id}
                      onClick={() => setSelectedEmblem(emblem)}
                      className={`
                        relative w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center bg-white shadow-sm overflow-hidden
                        ${selectedEmblem?.id === emblem.id 
                          ? 'border-black scale-105 shadow-md z-10' 
                          : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                        }
                      `}
                    >
                      <img src={emblem.path} alt={emblem.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Front Toggle & Placement */}
              <div className="space-y-6">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-black">Include front emblem</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Logo on the front side</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={includeFrontEmblem}
                      onChange={(e) => {
                        setIncludeFrontEmblem(e.target.checked);
                        if (e.target.checked) setViewMode('front');
                      }}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${includeFrontEmblem ? 'bg-black' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${includeFrontEmblem ? 'translate-x-5' : ''}`} />
                    </div>
                  </div>
                </label>

                {includeFrontEmblem && (
                  <div className="animate-slideIn">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 text-center">Front Placement</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {POSITIONS.map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => {
                            setSelectedPosition(pos.id);
                            setViewMode('front');
                          }}
                          className={`
                            p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-1
                            ${selectedPosition === pos.id 
                              ? 'border-black bg-black text-white shadow-lg' 
                              : 'border-gray-100 hover:border-gray-200 text-gray-600'
                            }
                          `}
                        >
                          <span className="text-[9px] font-bold uppercase tracking-tight leading-tight">{pos.label.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Back Toggle & Options */}
              <div className="pt-6 border-t space-y-8 pb-8">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-black">Include back emblem</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Logo on the back side</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={includeBackEmblem}
                      onChange={(e) => {
                        setIncludeBackEmblem(e.target.checked);
                        if (e.target.checked) setViewMode('back');
                      }}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${includeBackEmblem ? 'bg-black' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${includeBackEmblem ? 'translate-x-5' : ''}`} />
                    </div>
                  </div>
                </label>

                {includeBackEmblem && (
                  <div className="space-y-8 animate-slideIn">
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Back Size</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {BACK_SIZES.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => {
                              setBackEmblemSize(size.id);
                              setViewMode('back');
                            }}
                            className={`
                              py-2 px-3 rounded-lg border-2 transition-all text-[10px] font-bold uppercase tracking-wider
                              ${backEmblemSize === size.id 
                                ? 'border-black bg-black text-white shadow-md' 
                                : 'border-gray-100 hover:border-gray-200 text-gray-500'
                              }
                            `}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Back Alignment</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {BACK_ALIGNMENTS.map((align) => (
                          <button
                            key={align.id}
                            onClick={() => {
                              setBackEmblemAlignment(align.id);
                              setViewMode('back');
                            }}
                            className={`
                              py-2 px-3 rounded-lg border-2 transition-all text-[10px] font-bold uppercase tracking-wider
                              ${backEmblemAlignment === align.id 
                                ? 'border-black bg-black text-white shadow-md' 
                                : 'border-gray-100 hover:border-gray-200 text-gray-500'
                              }
                            `}
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 md:p-6 border-t bg-white z-20">
          <button
            onClick={handleApply}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            Finish Customization
          </button>
        </div>
    </PopUpModal>
  );
}

export default ProductCustomizer;
