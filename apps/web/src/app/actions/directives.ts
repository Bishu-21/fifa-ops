'use server';

/**
 * SERVER ACTION BRIDGE: processTelemetryAndGetDirective
 * 
 * INTENTIONAL SECURITY BOUNDARY:
 * - This file uses 'use server' to ensure all logic runs strictly on the Node.js server.
 * - The Gemini API Key (GEMINI_API_KEY) is fetched from system environment variables (process.env)
 *   and is NEVER exposed, leaked, or sent to the client browser.
 * - All telemetry parameter fields are explicitly whitelisted and reconstructed to ignore and strip
 *   unrecognized custom properties or prototype pollution attacks before calling the core generator.
 */

import { generateDirective, StadiumTelemetry, OperationalDirective } from '@fifa/core';

export async function processTelemetryAndGetDirective(
  telemetry: StadiumTelemetry
): Promise<OperationalDirective> {
  const apiKey = process.env.GEMINI_API_KEY;

  // --- 1. Input Sanitization & Whitelisting boundary ---
  const safeTelemetry = telemetry || {} as StadiumTelemetry;
  const safeCoords = safeTelemetry.coordinates || { x: 0.5, y: 0.5 };

  // Explicit property reconstruction
  const sanitizedTelemetry: StadiumTelemetry = {
    stadiumId: typeof safeTelemetry.stadiumId === 'string' ? safeTelemetry.stadiumId : 'Default-Stadium-Sector',
    timestamp: typeof safeTelemetry.timestamp === 'string' ? safeTelemetry.timestamp : new Date().toISOString(),
    anomalyDetected: !!safeTelemetry.anomalyDetected,
    crowdDensity: typeof safeTelemetry.crowdDensity === 'number' ? safeTelemetry.crowdDensity : 0,
    spatialCongestionRatio: typeof safeTelemetry.spatialCongestionRatio === 'number' ? safeTelemetry.spatialCongestionRatio : 0,
    noiseLevelDb: typeof safeTelemetry.noiseLevelDb === 'number' ? safeTelemetry.noiseLevelDb : 0,
    anomalyDescription: typeof safeTelemetry.anomalyDescription === 'string' ? safeTelemetry.anomalyDescription : 'No description provided',
    coordinates: {
      x: typeof safeCoords.x === 'number' ? safeCoords.x : 0.5,
      y: typeof safeCoords.y === 'number' ? safeCoords.y : 0.5
    }
  };

  // Safe delegation to core package
  return generateDirective(sanitizedTelemetry, apiKey);
}
