import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ARModal({ open, item, onClose }) {
  if (!open || !item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex flex-col"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h3 className="text-white font-semibold text-sm">{item.name}</h3>
              <p className="text-white/60 text-xs">3D View</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* 3D Model Viewer */}
          <div className="flex-1 flex items-center justify-center px-4 pb-6">
            <model-viewer
              src="https://modelviewer.dev/shared-assets/models/royal-t-burger-ube-spread.glb"
              alt={`3D model of ${item.name}`}
              auto-rotate
              camera-controls
              touch-action="pan-y"
              ar
              ar-modes="scene-viewer webxr quick-look"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '70vh',
                borderRadius: '1rem',
                background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
              }}
            >
              <div
                slot="poster"
                className="flex items-center justify-center w-full h-full"
              >
                <div className="text-white/40 text-sm">Loading 3D model...</div>
              </div>
            </model-viewer>
          </div>

          <p className="text-white/40 text-xs text-center pb-4">
            Pinch to zoom &middot; Drag to rotate
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
