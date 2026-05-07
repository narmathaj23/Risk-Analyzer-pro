export type Platform = 'YouTube' | 'Instagram' | 'Facebook';

export type ContentType = 'text' | 'image' | 'video' | 'audio';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface AnalysisResult {
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  confidence: number; // 0-100
  breakdown: {
    type: ContentType;
    score: number;
    details: string;
    risks: string[];
  }[];
  recommendations: {
    title: string;
    description: string;
    action: string;
  }[];
  safeVersion?: string;
  explanation: string;
}

export interface UploadedFile {
  file: File;
  preview: string;
  type: ContentType;
}
