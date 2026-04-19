import { useEffect, useMemo, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function QRScanner({ isOpen, onClose }) {
  const navigate = useNavigate();
  const setTable = useStore((s) => s.setTable);
  const scannerRef = useRef(null);
  const scannerRegionId = useMemo(
    () => `qr-scanner-region-${Math.random().toString(36).slice(2, 9)}`,
    []
  );
  const [scanError, setScanError] = useState('');
  const [isBooting, setIsBooting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const scanner = new Html5Qrcode(scannerRegionId, { verbose: false });
    scannerRef.current = scanner;
    setIsBooting(true);
    setScanError('');

    const extractTableNumber = (decodedText) => {
      if (!decodedText?.includes('table=')) return null;
      const match = decodedText.match(/table=(\d+)/i);
      if (!match) return null;
      return Number.parseInt(match[1], 10);
    };

    const handleSuccess = async (decodedText) => {
      const tableNumber = extractTableNumber(decodedText);
      if (!tableNumber) {
        setScanError("QR format invalid. Expected 'table=' value.");
        return;
      }

      try {
        await scanner.stop();
      } catch {
        // Ignore stop errors if scanner already stopped.
      }

      setTable(tableNumber);
      localStorage.setItem('tableNumber', String(tableNumber));
      onClose?.();
      navigate(`/menu/${tableNumber}`);
    };

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 12,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1,
          },
          handleSuccess,
          () => {}
        );
      } catch {
        if (isMounted) {
          setScanError('Camera unavailable. Please allow camera permission and try again.');
        }
      } finally {
        if (isMounted) setIsBooting(false);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      const activeScanner = scannerRef.current;
      if (activeScanner) {
        activeScanner
          .stop()
          .catch(() => {})
          .finally(() => {
            activeScanner.clear().catch(() => {});
          });
      }
      scannerRef.current = null;
    };
  }, [isOpen, navigate, onClose, scannerRegionId, setTable]);

  const handleCancel = async () => {
    const activeScanner = scannerRef.current;
    if (activeScanner) {
      try {
        await activeScanner.stop();
      } catch {
        // Ignore stop errors on manual close.
      }
      await activeScanner.clear().catch(() => {});
    }
    scannerRef.current = null;
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md flex flex-col justify-center px-5"
        >
          <div className="max-w-[420px] w-full mx-auto">
            <div className="mb-5 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs tracking-wide font-medium">
                <Sparkles className="w-3.5 h-3.5 text-gold-light" />
                Premium QR Entry
              </div>
              <h3 className="text-white text-2xl font-serif font-bold mt-3">Scan Your Table QR</h3>
              <p className="text-white/70 text-sm mt-1">
                Hold the QR inside the frame for instant menu access.
              </p>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-3xl p-4 shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
              <div className="relative rounded-2xl overflow-hidden border-4 border-sage-300 bg-black">
                <div id={scannerRegionId} className="w-full min-h-[320px]" />
                {isBooting && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-sm">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 animate-pulse" />
                      Starting camera...
                    </div>
                  </div>
                )}
              </div>
              {scanError && (
                <p className="mt-3 text-center text-sm text-tomato-200 bg-tomato-900/20 border border-tomato-300/30 rounded-lg py-2 px-3">
                  {scanError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full mt-5 bg-terracotta-300 text-white py-3.5 rounded-2xl font-semibold shadow-[0_10px_30px_rgba(224,122,95,0.45)] hover:bg-terracotta-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
