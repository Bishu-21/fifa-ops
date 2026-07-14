import { z } from 'zod';
import { StadiumTelemetrySchema, OperationalDirectiveSchema } from '../schema/index.js';

export type OperationalUiState = 'IDLE' | 'LOADING' | 'ANOMALY_CRITICAL' | 'ERROR';

export type StadiumTelemetry = z.infer<typeof StadiumTelemetrySchema>;
export type OperationalDirective = z.infer<typeof OperationalDirectiveSchema>;
