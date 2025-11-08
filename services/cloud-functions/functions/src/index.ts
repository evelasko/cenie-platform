/**
 * CENIE Platform - Firebase Cloud Functions
 * Translation Investigation LLM Agent
 */

import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest, Request } from 'firebase-functions/v2/https';
import { onDocumentCreated, FirestoreEvent } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { createLogger } from '@cenie/logger';
import { OPENAI_API_KEY, isEmulator } from './config/env';

// Set global options for cost control
setGlobalOptions({
  maxInstances: 10,
  region: 'europe-southwest1',
});

// Initialize CENIE logger
const cenieLogger = createLogger({
  name: 'cloud-functions',
  level: isEmulator() ? 'debug' : 'info',
  environment: isEmulator() ? 'development' : 'production',
});

/**
 * Health check endpoint
 */
export const health = onRequest(
  {
    cors: true,
  },
  async (_req: Request, res) => {
    cenieLogger.info('Health check requested');
    
    res.status(200).json({
      status: 'ok',
      service: 'cenie-cloud-functions',
      environment: isEmulator() ? 'development' : 'production',
      timestamp: new Date().toISOString(),
    });
  }
);

/**
 * Example: Translation Investigation HTTP endpoint
 * This will be replaced with actual LLM agent logic
 */
export const translationInvestigation = onRequest(
  {
    cors: [
      'https://cenie.org',
      'https://editorial.cenie.org',
      /localhost:\d+/,
    ],
    region: 'europe-southwest1',
    timeoutSeconds: 540, // 9 minutes for LLM processing
    memory: '2GiB',
    maxInstances: 10,
    secrets: [OPENAI_API_KEY],
  },
  async (req: Request, res) => {
    try {
      cenieLogger.info('Translation investigation request received', {
        method: req.method,
        path: req.path,
      });

      // Validate request
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      // Example response - replace with actual LLM agent logic
      const result = {
        success: true,
        message: 'Translation investigation endpoint ready',
        data: {
          query: req.body.query || 'No query provided',
          timestamp: new Date().toISOString(),
        },
      };

      cenieLogger.info('Translation investigation completed successfully');
      
      res.status(200).json(result);
    } catch (error) {
      cenieLogger.error('Translation investigation failed', error);
      logger.error('Translation investigation error:', error);
      
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * Example: Firestore trigger for async processing
 * Triggered when a new translation task is created
 */
export const onTranslationTaskCreated = onDocumentCreated(
  {
    document: 'translation-tasks/{taskId}',
    region: 'europe-southwest1',
    secrets: [OPENAI_API_KEY],
  },
  async (event: FirestoreEvent<any>) => {
    const taskData = event.data?.data();
    const taskId = event.params.taskId;

    cenieLogger.info('Translation task created', {
      taskId,
      data: taskData,
    });

    logger.info('Processing translation task:', { taskId });

    // TODO: Implement LLM agent logic here
    // Example: await translationAgent.process(taskId, taskData);

    cenieLogger.info('Translation task processed', { taskId });
  }
);
