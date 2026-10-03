import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Trash2, RotateCcw, HelpCircle, Grip, Plus, Minus } from 'lucide-react';

interface DetectiveScratchpadProps {
  category: 'squirrels' | 'space' | 'baking' | 'ocean' | 'toys';
}

interface CounterItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export default function DetectiveScratchpad({ category }: DetectiveScratchpadProps) {
  const [activeTab, setActiveTab] = useState<'counters' | 'draw'>('counters');
  
  // Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb'); // blue
  const [penWidth, setPenWidth] = useState(4);
  
  // Counters State
  const [counters, setCounters] = useState<CounterItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get emoji based on case category
  const getCategoryEmoji = () => {
    switch (category) {
      case 'squirrels': return '🌰';
      case 'space': return '⭐';
      case 'baking': return '🍪';
      case 'ocean': return '🐚';
      case 'toys': return '🧸';
      default: return '🟢';
    }
  };

  const getCategoryItemName = () => {
    switch (category) {
      case 'squirrels': return 'acorn';
      case 'space': return 'star';
      case 'baking': return 'cookie';
      case 'ocean': return 'shell';
      case 'toys': return 'toy block';
      default: return 'counter';
    }
  };

  // Canvas drawing handlers
  useEffect(() => {
    if (activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions based on client bounding rect
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = Math.max(rect.height, 260);
        // Retain background or configuration
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Counters Handlers
  const addCounter = () => {
    const emoji = getCategoryEmoji();
    // Random position inside container
    const width = containerRef.current?.clientWidth || 300;
    const height = containerRef.current?.clientHeight || 200;
    
    // Keep it away from borders
    const x = Math.max(30, Math.min(width - 50, Math.floor(Math.random() * (width - 60)) + 30));
    const y = Math.max(30, Math.min(height - 50, Math.floor(Math.random() * (height - 60)) + 30));

    const newCounter: CounterItem = {
      id: `counter-${Date.now()}-${Math.random()}`,
      emoji,
      x,
      y,
    };
    setCounters([...counters, newCounter]);
  };

  const removeCounter = (id: string) => {
    setCounters(counters.filter(c => c.id !== id));
  };

  const clearCounters = () => {
    setCounters([]);
  };

  // Reset helper when category changes
  useEffect(() => {
    setCounters([]);
    if (canvasRef.current) {
      clearCanvas();
    }
  }, [category]);

  return (
    <div id="scratchpad-container" className="bg-white rounded-2xl border-4 border-emerald-200 shadow-sm overflow-hidden flex flex-col h-[380px]">
      {/* Scratchpad Header */}
      <div className="bg-emerald-100 px-4 py-2 flex items-center justify-between border-b-2 border-emerald-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕵️‍♂️</span>
          <h3 className="font-sans font-semibold text-emerald-800 text-sm">Detective's Scratchpad</h3>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-emerald-200/60 p-1 rounded-lg">
          <button
            id="tab-counters"
            onClick={() => setActiveTab('counters')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'counters'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Counters {getCategoryEmoji()}
          </button>
          <button
            id="tab-draw"
            onClick={() => setActiveTab('draw')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'draw'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Scribble ✏️
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 relative bg-stone-50 overflow-hidden">
        {activeTab === 'counters' ? (
          <div 
            ref={containerRef}
            className="w-full h-full p-4 relative"
          >
            {/* Instruction Banner */}
            <div className="absolute top-2 left-2 right-2 bg-emerald-50/80 backdrop-blur-xs text-emerald-800 text-[11px] rounded-lg p-2 border border-emerald-100/50 flex items-start gap-1.5 pointer-events-none z-10">
              <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
              <span>
                <strong>How to solve:</strong> Add {getCategoryItemName()}s to represent the story! Tap a {getCategoryItemName()} to remove it. Count them to double check your answer!
              </span>
            </div>

            {/* Spawn Area */}
            <div className="w-full h-full pt-12 relative overflow-hidden">
              {counters.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <span className="text-3xl mb-1">🔍</span>
                  <p className="text-xs text-stone-400 font-medium">No counters on the board yet!</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Click "Add {getCategoryItemName()}" below to start counting!</p>
                </div>
              ) : (
                counters.map((counter) => (
                  <button
                    key={counter.id}
                    onClick={() => removeCounter(counter.id)}
                    style={{ left: `${counter.x}px`, top: `${counter.y}px` }}
                    className="absolute text-2xl p-1.5 active:scale-95 hover:scale-110 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 select-none filter drop-shadow-xs transition-transform"
                    title="Click to remove"
                  >
                    {counter.emoji}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative bg-amber-50/30">
            {/* Instruction Banner */}
            <div className="absolute top-2 left-2 right-2 bg-emerald-50/80 backdrop-blur-xs text-emerald-800 text-[11px] rounded-lg p-2 border border-emerald-100/50 flex items-start gap-1.5 pointer-events-none z-10">
              <Pencil className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
              <span>
                Use your finger or mouse to sketch out drawings, calculations, or tally marks below!
              </span>
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 cursor-crosshair touch-none"
            />
          </div>
        )}
      </div>

      {/* Control Footer */}
      <div className="bg-stone-50 border-t border-stone-200 p-3 flex items-center justify-between">
        {activeTab === 'counters' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600 bg-stone-200/60 px-2.5 py-1 rounded-full font-mono">
                Total: {counters.length} {getCategoryItemName()}{counters.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                id="btn-add-counter"
                onClick={addCounter}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add {getCategoryEmoji()}
              </button>
              <button
                id="btn-clear-counters"
                onClick={clearCounters}
                disabled={counters.length === 0}
                className="flex items-center gap-1 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Color & Size Pickers */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                {['#2563eb', '#dc2626', '#16a34a', '#4b5563'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      penColor === color ? 'ring-2 ring-emerald-500 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
              
              <div className="h-4 w-[1px] bg-stone-300" />
              
              {/* Pen Sizes */}
              <div className="flex items-center gap-1">
                {[3, 6, 10].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPenWidth(size)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border transition-colors cursor-pointer ${
                      penWidth === size 
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {size === 3 ? 'Thin' : size === 6 ? 'Medium' : 'Thick'}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="btn-clear-canvas"
              onClick={clearCanvas}
              className="flex items-center gap-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Canvas
            </button>
          </>
        )}
      </div>
    </div>
  );
}
