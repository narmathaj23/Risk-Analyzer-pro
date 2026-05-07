import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, FileText, Image as ImageIcon, Video, Music, 
  X, AlertCircle, CheckCircle2, ChevronRight, RefreshCcw,
  Youtube, Instagram, Facebook, Loader2, Sparkles
} from 'lucide-react';
import { cn, fileToBase64 } from '../lib/utils';
import { Platform, ContentType, UploadedFile, AnalysisResult } from '../types';
import { analyzeContent } from '../services/gemini';
import RiskMeter from './RiskMeter';

export default function Analyzer() {
  const [platform, setPlatform] = useState<Platform>('YouTube');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        let type: ContentType = 'image';
        if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) type = 'text';

        return {
          file,
          preview: URL.createObjectURL(file),
          type
        };
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav'],
      'text/*': ['.txt']
    }
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleAnalyze = async () => {
    if (!text && files.length === 0) {
      setError('Please provide some content to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const base64Files = await Promise.all(
        files.map(async (f) => ({
          data: await fileToBase64(f.file),
          mimeType: f.file.type,
          type: f.type
        }))
      );

      const analysis = await analyzeContent(platform, {
        text: text || undefined,
        files: base64Files.length > 0 ? base64Files : undefined
      });

      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFiles([]);
    setText('');
    setError(null);
  };

  const loadDemo = () => {
    setText("I'm using a remix of 'Blinding Lights' by The Weeknd in my new vlog. I've added some custom drum loops and a voiceover. Is this safe to post on YouTube?");
    setPlatform('YouTube');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Demo Button */}
            <div className="flex justify-end">
              <button
                onClick={loadDemo}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3" /> Try Demo Content
              </button>
            </div>

            {/* Platform Selector */}
            <div className="flex flex-col items-center gap-4 w-full">
              <h2 className="nav-group-label">Target Platform</h2>
              <div className="flex p-1 bg-white/5 border border-border rounded-full backdrop-blur-md max-w-full overflow-x-auto custom-scrollbar">
                {(['YouTube', 'Instagram', 'Facebook'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-full transition-all font-semibold text-[10px] sm:text-xs whitespace-nowrap",
                      platform === p 
                        ? "bg-white text-black shadow-lg" 
                        : "text-text-dim hover:text-text-main hover:bg-white/5"
                    )}
                  >
                    {p === 'YouTube' && <Youtube className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    {p === 'Instagram' && <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    {p === 'Facebook' && <Facebook className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Text Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-dim font-bold text-[10px] uppercase tracking-widest">
                  <FileText className="w-4 h-4 text-accent-blue" />
                  <h3>Script / Caption</h3>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your video script, captions, or description here..."
                  className="w-full h-48 sm:h-64 p-4 sm:p-6 bg-white/[0.02] border border-border rounded-2xl text-text-main text-sm sm:text-base placeholder:text-text-dim/30 focus:outline-none focus:border-accent-blue/50 transition-all resize-none backdrop-blur-sm"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-dim font-bold text-[10px] uppercase tracking-widest">
                  <Upload className="w-4 h-4 text-accent-purple" />
                  <h3>Media Assets</h3>
                </div>
                <div
                  {...getRootProps()}
                  className={cn(
                    "drop-zone-artistic h-48 sm:h-64 group transition-all cursor-pointer",
                    isDragActive ? "border-accent-blue bg-accent-blue/10" : "hover:border-accent-blue/50"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 text-accent-blue group-hover:scale-110 transition-transform">+</div>
                    <p className="text-text-main font-light text-base sm:text-lg mb-1">Drag content here to analyze</p>
                    <p className="text-text-dim text-[10px] sm:text-xs">Supports MP4, MP3, JPG, PNG & TXT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4"
              >
                {files.map((file, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border bg-white/5 group"
                  >
                    {file.type === 'image' ? (
                      <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 sm:gap-2 text-text-dim p-2">
                        {file.type === 'video' ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <Music className="w-5 h-5 sm:w-6 sm:h-6" />}
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase truncate w-full text-center">
                          {file.file.name}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 rounded-full bg-black/60 text-white lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-risk-high"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-risk-high/10 border border-risk-high/20 text-risk-high flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Action Button */}
            <div className="flex justify-center pt-8">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!text && files.length === 0)}
                className="btn-artistic min-w-[240px] shadow-[0_0_30px_rgba(0,209,255,0.2)] hover:shadow-[0_0_50px_rgba(0,209,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-3">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Start Analysis
                    </>
                  )}
                </span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-8"
          >
            {/* Summary/Score Highlight for Mobile */}
            <div className="lg:hidden glass-card p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="scale-75 origin-center -my-6">
                  <RiskMeter score={result.riskScore} level={result.riskLevel} />
                </div>
              </div>
              <div>
                <p 
                  className="text-lg font-bold uppercase tracking-[4px]"
                  style={{ color: result.riskLevel === 'Low' ? 'var(--color-risk-low)' : result.riskLevel === 'Medium' ? 'var(--color-risk-med)' : 'var(--color-risk-high)' }}
                >
                  {result.riskLevel} Risk
                </p>
                <p className="text-[10px] text-text-dim uppercase tracking-widest mt-1">Confidence Score: {result.confidence}%</p>
              </div>
            </div>

            {/* Main Results Area */}
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.breakdown.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-4 sm:p-5"
                  >
                    <div className="text-[9px] sm:text-[10px] uppercase text-text-dim mb-2">{item.type} & Content</div>
                    <div className="flex justify-between items-center">
                      <span className={cn(
                        "text-xs sm:text-sm font-semibold",
                        item.score < 30 ? "text-risk-low" : item.score < 70 ? "text-risk-med" : "text-risk-high"
                      )}>
                        {item.score < 30 ? "Clear Scan" : item.score < 70 ? "Moderate Policy Alert" : "High Infringement Risk"}
                      </span>
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0 ml-2" 
                        style={{ 
                          backgroundColor: item.score < 30 ? 'var(--color-risk-low)' : item.score < 70 ? 'var(--color-risk-med)' : 'var(--color-risk-high)',
                          boxShadow: `0 0 8px ${item.score < 30 ? 'var(--color-risk-low)' : item.score < 70 ? 'var(--color-risk-med)' : 'var(--color-risk-high)'}`
                        }} 
                      />
                    </div>
                    <p className="text-text-dim text-[10px] sm:text-[11px] mt-3 leading-relaxed">{item.details}</p>
                  </motion.div>
                ))}
              </div>

              {/* Safe Version */}
              {result.safeVersion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-5 sm:p-6 border-accent-blue/20 bg-accent-blue/[0.02]"
                >
                  <div className="flex items-center gap-2 text-accent-blue font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3>AI-Suggested Adjustment</h3>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-black/40 text-text-main/80 text-[10px] sm:text-xs leading-relaxed font-mono border border-white/5 break-words">
                    {result.safeVersion}
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.safeVersion!)}
                    className="mt-4 text-[9px] sm:text-[10px] font-bold text-accent-blue hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
                  >
                    Copy to Clipboard
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right Stats Panel - Hidden on very small screens, integrated into summary above */}
            <aside className="hidden lg:flex flex-col space-y-10 order-1 lg:order-2">
              <div className="text-center">
                <RiskMeter score={result.riskScore} level={result.riskLevel} />
                <p 
                  className="text-sm font-semibold uppercase tracking-widest mt-4"
                  style={{ color: result.riskLevel === 'Low' ? 'var(--color-risk-low)' : result.riskLevel === 'Medium' ? 'var(--color-risk-med)' : 'var(--color-risk-high)' }}
                >
                  {result.riskLevel} Risk
                </p>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-text-dim">AI Confidence</span>
                  <span className="text-accent-blue font-semibold">{result.confidence}%</span>
                </div>
                <div className="h-1 bg-[#1a1a1c] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    className="h-full bg-accent-blue"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="nav-group-label">RECOMMENDATIONS</div>
                {result.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={cn(
                      "recommendation-card-artistic",
                      i % 2 === 1 && "border-accent-blue bg-accent-blue/[0.05]"
                    )}
                  >
                    <div className={cn(
                      "text-[12px] font-bold mb-1",
                      i % 2 === 1 ? "text-accent-blue" : "text-risk-med"
                    )}>
                      {rec.title}
                    </div>
                    <div className="text-[11px] leading-relaxed text-text-dim">
                      {rec.description}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button className="btn-artistic text-xs py-3.5">Generate Full Report</button>
                <button 
                  onClick={reset}
                  className="text-[10px] font-bold text-text-dim hover:text-text-main transition-colors uppercase tracking-widest text-center"
                >
                  Start New Scan
                </button>
              </div>
            </aside>

            {/* Mobile Actions/Recommendations */}
            <div className="lg:hidden space-y-6 order-3">
              <div className="space-y-4">
                <div className="nav-group-label">KEY TAKEAWAYS</div>
                {result.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="glass-card p-4">
                    <div className="text-xs font-bold text-accent-blue mb-1">{rec.title}</div>
                    <div className="text-[10px] text-text-dim">{rec.description}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <button className="btn-artistic text-sm py-4 w-full">Full Report</button>
                <button 
                  onClick={reset}
                  className="text-[10px] font-bold text-text-dim py-2 uppercase tracking-[2px]"
                >
                  Try New Analysis
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
