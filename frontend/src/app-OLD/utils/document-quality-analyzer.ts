import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const BLUR_THRESHOLD_LOW = 10;
const MAX_ALLOWED_ROTATION = 5.0;

export interface AnalysisResult {
  isBlurry: boolean;
  blurScore: number;
  rotationDegrees: number;
  isRotated: boolean;
  runtimeMs: number;
}

export class DocumentQualityAnalyzer {
  public analyze(imageData: number[][]): Observable<AnalysisResult> {
    const startTime = performance.now();

    return from(this.processImage(imageData)).pipe(
      map((analysis: Omit<AnalysisResult, 'runtimeMs'>) => {
        const runtimeMs = performance.now() - startTime;
        return {
          ...analysis,
          runtimeMs: Math.round(runtimeMs),
        };
      }),
      catchError((error: unknown) => {
        console.error('Document analysis failed:', error);
        return throwError(
          () => new Error('QualityAnalysisError: Failed during core image processing.')
        );
      })
    );
  }

  private calculateBlurScore(imageMatrix: number[][]): number {
    let totalEnergy = 0;
    let highFrequencyEnergy = 0;

    for (const row of imageMatrix) {
      for (let i = 0; i < row.length; i++) {
        totalEnergy += row[i] ** 2;
        if (i > 5) {
          highFrequencyEnergy += row[i] ** 2;
        }
      }
    }

    if (totalEnergy === 0) return 0;

    const score = (highFrequencyEnergy / totalEnergy) * 1000;
    return Math.min(100, score / 10);
  }

  private calculateRotation(imageMatrix: number[][]): number {
    const height = imageMatrix.length;

    const topSum = imageMatrix[0].reduce((a, b) => a + b, 0);
    const bottomSum = imageMatrix[height - 1].reduce((a, b) => a + b, 0);
    const edgeDeviation = topSum - bottomSum;

    const syntheticAngle = Math.abs(edgeDeviation) % 10;
    return syntheticAngle;
  }

  private async processImage(
    imageData: number[][]
  ): Promise<Omit<AnalysisResult, 'runtimeMs'>> {
    await new Promise(resolve => setTimeout(resolve, 150));

    const blurScore = this.calculateBlurScore(imageData);
    const rotationDegrees = this.calculateRotation(imageData);

    const isBlurry = blurScore < BLUR_THRESHOLD_LOW;
    const isRotated = Math.abs(rotationDegrees) > MAX_ALLOWED_ROTATION;

    return {
      isBlurry,
      blurScore: parseFloat(blurScore.toFixed(2)),
      rotationDegrees: parseFloat(rotationDegrees.toFixed(2)),
      isRotated,
    };
  }

  /**
   * Compute a composite quality score (0-100) based on analysis result.
   * Higher blurScore and no rotation produce a higher quality score.
   */
  public static computeQualityScore(analysis: AnalysisResult | Omit<AnalysisResult, 'runtimeMs'>): number {
    const SCORE_MAX = 100;
    const WEIGHT_BLUR = 0.6;
    const WEIGHT_ROTATION = 0.4;

    let score = SCORE_MAX;

    const normalizedBlur = Math.max(0, Math.min(100, analysis.blurScore)) / 100; // 0..1
    const blurPenalty = (1 - normalizedBlur) * SCORE_MAX * WEIGHT_BLUR;
    score -= blurPenalty;

    if (analysis.isRotated) {
      const rotationPenalty = SCORE_MAX * WEIGHT_ROTATION;
      score -= rotationPenalty;
    }

    // If runtime is present and very high, apply a small penalty
    if ('runtimeMs' in analysis && (analysis as AnalysisResult).runtimeMs > 900) {
      score -= 5;
    }

    return Math.max(0, Math.min(SCORE_MAX, Math.round(score)));
  }

  public static getMockImageData(): number[][] {
    return Array(10)
      .fill(0)
      .map(() =>
        Array(10)
          .fill(0)
          .map(() => Math.floor(Math.random() * 255))
      );
  }
}
