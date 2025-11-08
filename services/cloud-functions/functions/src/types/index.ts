/**
 * Type definitions for Cloud Functions
 */

export interface TranslationTaskData {
  query: string;
  sourceLanguage: string;
  targetLanguage: string;
  userId: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface TranslationResult {
  taskId: string;
  investigation: string;
  completedAt: string;
  metadata?: Record<string, unknown>;
}

export interface InvestigationRequest {
  query: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  context?: Record<string, unknown>;
}

export interface InvestigationResponse {
  success: boolean;
  data?: TranslationResult;
  error?: string;
}

