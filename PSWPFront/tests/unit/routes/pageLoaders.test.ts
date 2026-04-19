import { describe, expect, test } from 'vitest';
import { prefetchRouteChunk } from '../../../src/routes/pageLoaders';

describe('pageLoaders', () => {
  test('accepts known path and duplicate calls', () => {
    expect(() => prefetchRouteChunk('/')).not.toThrow();
    expect(() => prefetchRouteChunk('/')).not.toThrow();
  });

  test('ignores unknown path', () => {
    expect(() => prefetchRouteChunk('/unknown/path')).not.toThrow();
  });
});