import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar({ onStart }: { onStart: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl"
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Analyzer Pro
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-white/60 hover:text-white transition-colors">How it Works</a>
            <button
              onClick={onStart}
              className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-all active:scale-95"
            >
              Analyze Now
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-6">
              {['Features', 'How it Works', 'Pricing', 'Docs'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-lg font-light text-white/70 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <button
                onClick={() => { onStart(); setIsOpen(false); }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 text-white font-bold text-lg active:scale-95 transition-transform"
              >
                Analyze Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
