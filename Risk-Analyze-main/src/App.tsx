import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import { cn } from './lib/utils';
import { Shield, Layout, History, FileText, Library, Scissors, Music, Settings, HelpCircle, Menu, X as CloseIcon } from 'lucide-react';

export default function App() {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [activeView, setActiveView] = useState('live-analysis');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const analyzerRef = useRef<HTMLDivElement>(null);

  const startAnalysis = () => {
    setShowAnalyzer(true);
    setActiveView('live-analysis');
    setTimeout(() => {
      analyzerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderView = () => {
    switch (activeView) {
      case 'live-analysis':
        return <Analyzer />;
      case 'recent-scans':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-text-dim">
            <History className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-xl font-light">No recent scans found</h2>
            <p className="text-sm mt-2">Your analysis history will appear here.</p>
          </div>
        );
      case 'draft-reports':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-text-dim">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-xl font-light">No draft reports</h2>
            <p className="text-sm mt-2">Save your analysis results to view them later.</p>
          </div>
        );
      case 'library':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-text-dim">
            <Library className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-xl font-light">Library Archive</h2>
            <p className="text-sm mt-2">Store and manage your safe content assets.</p>
          </div>
        );
      case 'sanitizer':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-text-dim">
            <Scissors className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-xl font-light">Script Sanitizer</h2>
            <p className="text-sm mt-2">Automatically remove potentially infringing phrases from your scripts.</p>
          </div>
        );
      case 'shifter':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-text-dim">
            <Music className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-xl font-light">Audio Shifter</h2>
            <p className="text-sm mt-2">Modify audio pitch and tempo to avoid automated fingerprinting.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl space-y-8">
            <h2 className="text-2xl font-light">Settings</h2>
            <div className="glass-card p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold">AI Model Precision</div>
                  <div className="text-xs text-text-dim">Higher precision takes longer to analyze</div>
                </div>
                <div className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold">BALANCED</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold">Auto-Save Reports</div>
                  <div className="text-xs text-text-dim">Automatically save results to Drafts</div>
                </div>
                <div className="w-8 h-4 bg-white/10 rounded-full relative">
                  <div className="absolute left-1 top-1 w-2 h-2 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="max-w-2xl space-y-8">
            <h2 className="text-2xl font-light">Help Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Copyright Basics', 'Fair Use Guide', 'Platform Policies', 'API Documentation'].map((item) => (
                <div key={item} className="glass-card p-4 hover:border-accent-blue/30 transition-colors cursor-pointer">
                  <div className="text-sm font-bold mb-1">{item}</div>
                  <div className="text-[10px] text-text-dim">Learn more about {item.toLowerCase()}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <Analyzer />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans selection:bg-accent-blue/30 overflow-x-hidden">
      <Background3D />
      
      {!showAnalyzer && <Navbar onStart={startAnalysis} />}

      <main>
        <AnimatePresence mode="wait">
          {!showAnalyzer ? (
            <motion.div
              key="landing"
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Hero onStart={startAnalysis} />
              
              <section id="features" className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                      <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        BUILT FOR THE <br />
                        <span className="text-accent-blue">MODERN CREATOR.</span>
                      </h2>
                      <p className="text-xl text-text-dim leading-relaxed">
                        Whether you're a YouTuber, TikToker, or Social Media Manager, our platform gives you the confidence to publish without fear.
                      </p>
                      <ul className="space-y-6">
                        {[
                          "Visual Frame-by-Frame Scanning",
                          "Audio Fingerprint Matching",
                          "Plagiarism & Script Similarity",
                          "Trademark & Logo Detection"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-4 text-white/80 font-bold">
                            <div className="w-2 h-2 rounded-full bg-accent-blue" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-[40px] blur-2xl opacity-20 animate-pulse" />
                      <div className="relative aspect-square rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center overflow-hidden">
                        <div className="grid grid-cols-2 gap-4 w-full h-full">
                          <div className="rounded-3xl bg-white/5 border border-white/10" />
                          <div className="rounded-3xl bg-white/5 border border-white/10" />
                          <div className="rounded-3xl bg-white/5 border border-white/10" />
                          <div className="rounded-3xl bg-white/5 border border-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="analyzer-workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-screen overflow-hidden border border-border relative"
            >
              {/* SIDEBAR - Responsive Overlay for Mobile */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
                  />
                )}
              </AnimatePresence>
              
      <aside 
        className={cn(
          "fixed lg:relative top-0 left-0 z-50 w-[240px] h-screen bg-[#0a0a0c] border-r border-border p-6 flex flex-col gap-8 flex-shrink-0 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between lg:block mb-4">
          <div 
            className="logo text-lg font-black tracking-tight uppercase gradient-text cursor-pointer"
            onClick={() => { setShowAnalyzer(false); setIsSidebarOpen(false); }}
          >
            Analyzer Pro
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-text-dim hover:text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-2">
          <div>
            <div className="nav-group-label">WORKSPACE</div>
            <div className="space-y-1">
              <div 
                className={cn("nav-item-artistic", activeView === 'live-analysis' && "active")}
                onClick={() => { setActiveView('live-analysis'); setIsSidebarOpen(false); }}
              >
                <Layout className="w-4 h-4" /> 
                <span>Live Analysis</span>
              </div>
              <div 
                className={cn("nav-item-artistic", activeView === 'recent-scans' && "active")}
                onClick={() => { setActiveView('recent-scans'); setIsSidebarOpen(false); }}
              >
                <History className="w-4 h-4" /> 
                <span>Recent Scans</span>
              </div>
              <div 
                className={cn("nav-item-artistic", activeView === 'draft-reports' && "active")}
                onClick={() => { setActiveView('draft-reports'); setIsSidebarOpen(false); }}
              >
                <FileText className="w-4 h-4" /> 
                <span>Draft Reports</span>
              </div>
            </div>
          </div>

          <div>
            <div className="nav-group-label">TOOLS</div>
            <div className="space-y-1">
              <div 
                className={cn("nav-item-artistic", activeView === 'library' && "active")}
                onClick={() => { setActiveView('library'); setIsSidebarOpen(false); }}
              >
                <Library className="w-4 h-4" /> 
                <span>Library Archive</span>
              </div>
              <div 
                className={cn("nav-item-artistic", activeView === 'sanitizer' && "active")}
                onClick={() => { setActiveView('sanitizer'); setIsSidebarOpen(false); }}
              >
                <Scissors className="w-4 h-4" /> 
                <span>Script Sanitizer</span>
              </div>
              <div 
                className={cn("nav-item-artistic", activeView === 'shifter' && "active")}
                onClick={() => { setActiveView('shifter'); setIsSidebarOpen(false); }}
              >
                <Music className="w-4 h-4" /> 
                <span>Audio Shifter</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5 space-y-1">
            <div 
              className={cn("nav-item-artistic", activeView === 'settings' && "active")}
              onClick={() => { setActiveView('settings'); setIsSidebarOpen(false); }}
            >
              <Settings className="w-4 h-4" /> 
              <span>Settings</span>
            </div>
            <div 
              className={cn("nav-item-artistic", activeView === 'help' && "active")}
              onClick={() => { setActiveView('help'); setIsSidebarOpen(false); }}
            >
              <HelpCircle className="w-4 h-4" /> 
              <span>Help Center</span>
            </div>
          </div>
        </div>
      </aside>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 flex flex-col overflow-hidden workspace-gradient relative">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                  <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      >
                        <Menu className="w-5 h-5" />
                      </button>
                      <div className="title-area">
                        <h1 className="text-xl md:text-[28px] font-light tracking-[-0.5px]">
                          {activeView === 'live-analysis' ? 'New Content Scan' : 
                           activeView === 'recent-scans' ? 'Recent History' :
                           activeView === 'draft-reports' ? 'Saved Drafts' :
                           activeView === 'library' ? 'Asset Library' :
                           activeView === 'sanitizer' ? 'Script Sanitizer' :
                           activeView === 'shifter' ? 'Audio Shifter' :
                           activeView === 'settings' ? 'System Settings' :
                           'Help & Support'}
                        </h1>
                      </div>
                    </div>
                  </header>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeView}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderView()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-white/20 uppercase tracking-widest pointer-events-none">
                  This tool provides AI-generated insights and not legal advice.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!showAnalyzer && (
        <footer className="relative z-10 py-12 border-t border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-white/20 text-sm">
              © 2026 Analyzer Pro. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
