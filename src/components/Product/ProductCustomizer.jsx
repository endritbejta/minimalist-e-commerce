import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  BACK_ALIGNMENTS,
  BACK_SIZES,
  DEFAULT_BACK_ALIGNMENT,
  DEFAULT_BACK_SIZE,
  DEFAULT_POSITION,
  EMBLEMS,
  POSITIONS,
  getBackPlacement,
  getFrontPlacement,
} from '../../lib/emblem';
import PopUpModal from '../UI/PopUpModal';

/**
 * ToggleSwitch
 * A labelled on/off control. Built from a button with `role="switch"` so it
 * carries a visible focus ring — the previous sr-only checkbox left keyboard
 * users with no indication of where focus was.
 * @param {Object} props - Component props.
 * @param {boolean} props.checked - Current state.
 * @param {Function} props.onChange - Called with the next state.
 * @param {string} props.title - Primary label.
 * @param {string} props.description - Supporting copy.
 */
function ToggleSwitch({ checked, onChange, title, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full text-left group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <span className="flex flex-col">
        <span className="text-sm font-bold text-gray-900 group-hover:text-black">{title}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-black' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  );
}

/**
 * OptionGroup
 * A row of mutually exclusive choices rendered as a radio group.
 * @param {Object} props - Component props.
 * @param {string} props.label - Group heading.
 * @param {{id: string, label: string}[]} props.options - Available choices.
 * @param {string} props.value - Currently selected option id.
 * @param {Function} props.onChange - Called with the chosen option id.
 */
function OptionGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</h3>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={value === option.id}
            onClick={() => onChange(option.id)}
            className={`py-2 px-3 rounded-lg border-2 transition-all text-[10px] font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
              value === option.id
                ? 'border-black bg-black text-white shadow-md'
                : 'border-gray-100 hover:border-gray-200 text-gray-500'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * ProductCustomizer Component
 * An interactive interface for applying custom emblems and placements.
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the customizer is visible.
 * @param {Function} props.onClose - Function to close the customizer.
 * @param {Function} props.onApply - Callback when customization is finished.
 * @param {Object} [props.currentCustomization] - Existing customization to edit.
 */
function ProductCustomizer({ isOpen, onClose, onApply, currentCustomization }) {
  const [selectedEmblem, setSelectedEmblem] = useState(
    currentCustomization?.emblem ?? EMBLEMS[0]
  );
  const [selectedPosition, setSelectedPosition] = useState(
    currentCustomization?.position ?? DEFAULT_POSITION
  );
  const [includeFrontEmblem, setIncludeFrontEmblem] = useState(
    currentCustomization?.includeFrontEmblem ?? true
  );
  const [includeBackEmblem, setIncludeBackEmblem] = useState(
    currentCustomization?.includeBackEmblem ?? false
  );
  const [backEmblemSize, setBackEmblemSize] = useState(
    currentCustomization?.backEmblemSize ?? DEFAULT_BACK_SIZE
  );
  const [backEmblemAlignment, setBackEmblemAlignment] = useState(
    currentCustomization?.backEmblemAlignment ?? DEFAULT_BACK_ALIGNMENT
  );
  const [viewMode, setViewMode] = useState('front');

  const handleApply = () => {
    onApply({
      emblem: selectedEmblem,
      position: selectedPosition,
      includeFrontEmblem,
      includeBackEmblem,
      backEmblemSize,
      backEmblemAlignment,
    });
    onClose();
  };

  const showFront = viewMode === 'front' && includeFrontEmblem && selectedEmblem;
  const showBack = viewMode === 'back' && includeBackEmblem && selectedEmblem;
  const placement = showBack
    ? getBackPlacement(backEmblemSize, backEmblemAlignment)
    : getFrontPlacement(selectedPosition);

  return (
    <PopUpModal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-5xl bg-white p-0"
      aria-label="Customize your shirt"
    >
      {/* Fixed Header */}
      <div className="p-4 md:p-6 border-b flex items-center justify-between bg-white">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Placement Options</h2>
          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">
            Customize your layout
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-3 hover:bg-gray-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          aria-label="Close customizer"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto md:overflow-y-hidden min-h-0">
        <div className="flex flex-col md:flex-row h-full md:overflow-hidden">
          {/* Visual Preview */}
          <div className="w-full md:w-3/5 bg-gray-50 p-4 md:p-6 md:pt-2 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r">
            <div className="relative w-full max-w-[240px] md:max-w-[280px] aspect-[4/5] flex items-center justify-center">
              <div className="relative w-full h-full">
                <img
                  src={
                    viewMode === 'front'
                      ? '/assets/tshirt_mockup_front.png'
                      : '/assets/tshirt_mockup_back.png'
                  }
                  alt={`T-shirt, ${viewMode} view`}
                  className="w-full h-full object-contain transition-opacity duration-300"
                />

                {(showFront || showBack) && (
                  <div
                    className="absolute z-10 flex items-center justify-center transition-all duration-500 ease-in-out"
                    style={placement}
                  >
                    <img
                      src={selectedEmblem.path}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-contain animate-fadeIn"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* View Switcher */}
            <div
              role="radiogroup"
              aria-label="Garment side"
              className="mt-4 flex bg-gray-200/50 p-1 rounded-full backdrop-blur-sm"
            >
              {['front', 'back'].map((side) => (
                <button
                  key={side}
                  type="button"
                  role="radio"
                  aria-checked={viewMode === side}
                  onClick={() => setViewMode(side)}
                  className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    viewMode === side
                      ? 'bg-black text-white shadow-lg'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {side}
                </button>
              ))}
            </div>
          </div>

          {/* Placement Controls */}
          <div className="w-full md:w-2/5 p-6 space-y-8 bg-white md:overflow-y-auto h-full max-h-[60vh]">
            <div className="w-full space-y-3 pb-8 border-b">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Select Your Emblem
              </h3>
              <div className="flex flex-wrap justify-start gap-2" role="radiogroup" aria-label="Emblem">
                {EMBLEMS.map((emblem) => (
                  <button
                    key={emblem.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedEmblem?.id === emblem.id}
                    aria-label={emblem.name}
                    onClick={() => setSelectedEmblem(emblem)}
                    className={`relative w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center bg-white shadow-sm overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                      selectedEmblem?.id === emblem.id
                        ? 'border-black scale-105 shadow-md z-10'
                        : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={emblem.path} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Front */}
            <div className="space-y-6">
              <ToggleSwitch
                checked={includeFrontEmblem}
                onChange={(next) => {
                  setIncludeFrontEmblem(next);
                  if (next) setViewMode('front');
                }}
                title="Include front emblem"
                description="Logo on the front side"
              />

              {includeFrontEmblem && (
                <div className="animate-slideIn">
                  <OptionGroup
                    label="Front Placement"
                    options={POSITIONS}
                    value={selectedPosition}
                    onChange={(id) => {
                      setSelectedPosition(id);
                      setViewMode('front');
                    }}
                  />
                </div>
              )}
            </div>

            {/* Back */}
            <div className="pt-6 border-t space-y-8 pb-8">
              <ToggleSwitch
                checked={includeBackEmblem}
                onChange={(next) => {
                  setIncludeBackEmblem(next);
                  if (next) setViewMode('back');
                }}
                title="Include back emblem"
                description="Logo on the back side"
              />

              {includeBackEmblem && (
                <div className="space-y-8 animate-slideIn">
                  <OptionGroup
                    label="Back Size"
                    options={BACK_SIZES}
                    value={backEmblemSize}
                    onChange={(id) => {
                      setBackEmblemSize(id);
                      setViewMode('back');
                    }}
                  />
                  <OptionGroup
                    label="Back Alignment"
                    options={BACK_ALIGNMENTS}
                    value={backEmblemAlignment}
                    onChange={(id) => {
                      setBackEmblemAlignment(id);
                      setViewMode('back');
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="p-4 md:p-6 border-t bg-white">
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          Finish Customization
        </button>
      </div>
    </PopUpModal>
  );
}

export default ProductCustomizer;
