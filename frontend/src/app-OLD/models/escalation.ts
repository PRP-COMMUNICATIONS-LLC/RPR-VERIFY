export type EscalationLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EscalationStatus =
  | 'IDLE'
  | 'PENDING'
  | 'ACTIVE'
  | 'RESOLVED'
  | 'FAILED'
  | 'MANUALLY_RESOLVED'
  | 'AUTO_CLOSED';

export interface EscalationState {
  reportId: string;
  escalationLevel: number;
  status: EscalationStatus;
  lastCheckTimestamp: string;
  routeTarget: string;
  notificationsSent: string[];
  resolutionNote?: string;
  actionTaken?: string;
  riskMarker?: number;
  matchScore?: number;
  extractedMetadata?: {
    institution?: string;
    accountNumber?: string;
    [key: string]: any;
  };
}

export interface EscalationRowUI {
  id: string;
  level: EscalationLevel;
  target: string;
  status: EscalationStatus;
  lastUpdated: Date;
  isResolved: boolean;
  riskMarker: number;
  matchScore: number;
  extractedMetadata?: {
    institution?: string;
    accountNumber?: string;
    [key: string]: any;
  };
  mismatches?: any[];

  // Quality assessment fields (optional, added by UI enrichment)
  qualityScore?: number; // 0-100 composite score
  primaryQualityIssue?: 'Blur' | 'Rotation' | 'Blur & Rotation' | 'None';
  qualityAnalysisRuntime?: number; // ms
  qualityStatus?: 'Good' | 'Fair' | 'Poor';
}

export interface EscalationTriggerResponse {
  success: boolean;
  currentState: EscalationState;
  actionTaken: string;
}

export function mapLevelNumberToLevelName(level: number): EscalationLevel {
  if (level >= 3) return 'CRITICAL';
  if (level === 2) return 'HIGH';
  if (level === 1) return 'MEDIUM';
  if (level === 0) return 'LOW';
  return 'NONE';
}

export function mapApiStateToRowUI(apiState: EscalationState): EscalationRowUI {
  const isResolved =
    apiState.status === 'RESOLVED' ||
    apiState.status === 'MANUALLY_RESOLVED' ||
    apiState.status === 'AUTO_CLOSED';

  return {
    id: apiState.reportId,
    level: mapLevelNumberToLevelName(apiState.escalationLevel),
    target: apiState.routeTarget,
    status: apiState.status,
    lastUpdated: new Date(apiState.lastCheckTimestamp),
    isResolved,
    riskMarker: apiState.riskMarker ?? apiState.escalationLevel,
    matchScore: apiState.matchScore ?? 0,
    extractedMetadata: apiState.extractedMetadata
  };
}
