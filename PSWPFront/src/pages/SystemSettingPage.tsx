import React, { useCallback, useEffect, useState } from 'react';
import { getSystemSetting, updateSystemSetting } from '../api/systemSetting';

const SystemSettingPage: React.FC = () => {
  const [mipsFilePath, setMipsFilePath]     = useState('');
  const [strikeFilePath, setStrikeFilePath] = useState('');
  const [updateUser, setUpdateUser]         = useState<string | null>(null);
  const [updateTime, setUpdateTime]         = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [saved, setSaved]                   = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const data = await getSystemSetting();
      setMipsFilePath(data.mipsFilePath ?? '');
      setStrikeFilePath(data.strikeFilePath ?? '');
      setUpdateUser(data.updateUser ?? null);
      setUpdateTime(data.updateTime ?? null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const data = await updateSystemSetting({ mipsFilePath, strikeFilePath });
      setUpdateUser(data.updateUser ?? null);
      setUpdateTime(data.updateTime ?? null);
      setSaved(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <h2 style={{ flex: 1, fontSize: '1.1rem' }}>System Setting</h2>
        <button style={toolbarBtn('#4e9af1')} onClick={loadData} disabled={loading}>
          ⟳ Reload
        </button>
      </div>

      {error && (
        <div style={errorStyle}>{error}</div>
      )}

      {loading ? (
        <div style={{ color: '#888', fontSize: '0.9rem' }}>Loading...</div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={fieldWrap}>
            <label style={labelStyle}>MIPS File Path</label>
            <input
              style={inputStyle}
              value={mipsFilePath}
              placeholder="e.g. C:\data\mips\input.csv"
              onChange={e => setMipsFilePath(e.target.value)}
            />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Strike File Path</label>
            <input
              style={inputStyle}
              value={strikeFilePath}
              placeholder="e.g. C:\data\strike\input.csv"
              onChange={e => setStrikeFilePath(e.target.value)}
            />
          </div>

          {updateTime && (
            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 16 }}>
              Last updated by {updateUser ?? 'anonymous'}: {new Date(updateTime).toLocaleString()}
            </div>
          )}

          {saved && (
            <div style={savedStyle}>Saved successfully.</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const toolbarBtn = (bg: string): React.CSSProperties => ({
  padding: '6px 14px', background: bg, color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
});

const saveBtn: React.CSSProperties = {
  padding: '7px 28px', background: '#27ae60', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
};

const fieldWrap: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.85rem', fontWeight: 600, color: '#334',
};

const inputStyle: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #ccc', borderRadius: 4,
  fontSize: '0.9rem', width: '100%', boxSizing: 'border-box',
};

const errorStyle: React.CSSProperties = {
  marginBottom: 12, padding: '6px 12px',
  background: '#fdf2f2', border: '1px solid #f5c6cb',
  borderRadius: 4, color: '#c0392b', fontSize: '0.85rem',
};

const savedStyle: React.CSSProperties = {
  marginBottom: 12, padding: '6px 12px',
  background: '#f0fdf4', border: '1px solid #86efac',
  borderRadius: 4, color: '#166534', fontSize: '0.85rem',
};

export default SystemSettingPage;
