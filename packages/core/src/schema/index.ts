import { z } from 'zod';

export const StadiumTelemetrySchema = z.object({
  stadiumId: z.string(),
  timestamp: z.string().datetime(),
  crowdDensity: z.number().min(0).max(1),
  noiseLevelDb: z.number().min(0),
  spatialCongestionRatio: z.number().min(0).max(1),
  anomalyDetected: z.boolean(),
  anomalyDescription: z.string().optional().nullable(),
  coordinates: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const OperationalDirectiveSchema = z.object({
  id: z.string(),
  telemetryId: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  headline: z.string(),
  explanation: z.string(),
  recommendedRoute: z.array(z.string()),
  actionSteps: z.array(z.string()),
  targetGroup: z.string(),
  timestamp: z.string().datetime(),
  // Multilingual announcer scripts generated in real-time
  announcements: z.object({
    en: z.string(),
    es: z.string(),
    pt: z.string(),
  }),
  reasoning: z.string(), // Explainable AI reasoning chain
});
