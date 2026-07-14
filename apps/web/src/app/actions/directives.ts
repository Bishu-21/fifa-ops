'use server';

import { generateDirective, StadiumTelemetry, OperationalDirective } from '@fifa/core';

export async function processTelemetryAndGetDirective(
  telemetry: StadiumTelemetry
): Promise<OperationalDirective> {
  // Safe: process.env.GEMINI_API_KEY only exists on the server side in Next.js Server Actions
  const apiKey = process.env.GEMINI_API_KEY;
  return generateDirective(telemetry, apiKey);
}
