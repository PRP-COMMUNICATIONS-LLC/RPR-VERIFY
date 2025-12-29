import { describe, it, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { DocumentQualityAnalyzer, AnalysisResult } from './document-quality-analyzer';

describe('DocumentQualityAnalyzer', () => {
  it('analyze() should return valid analysis result', async () => {
    const analyzer = new DocumentQualityAnalyzer();
    const data = DocumentQualityAnalyzer.getMockImageData();

    const result: AnalysisResult = await firstValueFrom(analyzer.analyze(data));

    expect(result).toHaveProperty('isBlurry');
    expect(result).toHaveProperty('blurScore');
    expect(result).toHaveProperty('rotationDegrees');
    expect(result).toHaveProperty('isRotated');
    expect(result).toHaveProperty('runtimeMs');

    // runtime should be a small non-negative number
    expect(result.runtimeMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.blurScore).toBe('number');
  });

  it('computeQualityScore should penalize blur and rotation', () => {
    const sharp: Omit<AnalysisResult, 'runtimeMs'> = {
      isBlurry: false,
      blurScore: 90,
      rotationDegrees: 0,
      isRotated: false,
    };

    const blurry: Omit<AnalysisResult, 'runtimeMs'> = {
      isBlurry: true,
      blurScore: 2,
      rotationDegrees: 0,
      isRotated: false,
    };

    const rotated: Omit<AnalysisResult, 'runtimeMs'> = {
      isBlurry: false,
      blurScore: 90,
      rotationDegrees: 7,
      isRotated: true,
    };

    const scoreSharp = DocumentQualityAnalyzer.computeQualityScore(sharp);
    const scoreBlurry = DocumentQualityAnalyzer.computeQualityScore(blurry);
    const scoreRotated = DocumentQualityAnalyzer.computeQualityScore(rotated);

    expect(scoreSharp).toBeGreaterThan(scoreBlurry);
    expect(scoreSharp).toBeGreaterThan(scoreRotated);
  });
});
