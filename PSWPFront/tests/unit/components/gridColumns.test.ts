import { describe, expect, test } from 'vitest';
import {
  createIdColumn,
  createUpdateTimeColumn,
  createUpdateUserColumn,
} from '../../../src/components/gridColumns';

describe('gridColumns', () => {
  test('createIdColumn builds id column with formatter and tooltip', () => {
    const col = createIdColumn<{ id: number }>();

    expect(col.headerName).toBe('ID');
    expect(col.filter).toBe('agTextColumnFilter');
    expect(col.valueFormatter?.({ value: '1234567890' } as any)).toBe('12345678...');
    expect(col.valueFormatter?.({ value: '' } as any)).toBe('');
    expect(col.tooltipValueGetter?.({ value: 'abc' } as any)).toBe('abc');
  });

  test('createUpdateUserColumn builds update user column', () => {
    const col = createUpdateUserColumn<{ updateUser: string }>();

    expect(col.headerName).toBe('Update User');
    expect(col.filter).toBe('agTextColumnFilter');
    expect(col.resizable).toBe(true);
  });

  test('createUpdateTimeColumn formats datetime and empty value', () => {
    const col = createUpdateTimeColumn<{ updateTime: string }>();

    expect(col.headerName).toBe('Update Time');
    expect(col.filter).toBe('agDateColumnFilter');
    expect(col.valueFormatter?.({ value: '' } as any)).toBe('');

    const formatted = col.valueFormatter?.({ value: '2026-04-19T00:00:00Z' } as any);
    expect(typeof formatted).toBe('string');
    expect(formatted).not.toBe('');
  });
});