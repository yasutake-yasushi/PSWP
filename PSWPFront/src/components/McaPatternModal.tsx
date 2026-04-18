import React, { useEffect, useState } from 'react';
import { McaPattern, McaPatternInput, ItemValueRow } from '../api/mcaPatterns';
import { Mca } from '../api/mcas';
import './ContractItemModal.css';
import './McaPatternModal.css';

export type ModalMode = 'add' | 'view' | 'edit';

interface Props {
  mode: ModalMode;
  item?: McaPattern;
  mcas: Mca[];              // full MCA list
  onClose: () => void;
  onSave: (input: McaPatternInput) => Promise<void>;
}

type TabKey = 'contract' | 'trade' | 'special';

const ALNUM_RE = /^[A-Za-z0-9]*$/;
const ALNUM_MULTI_RE = /^[A-Za-z0-9\n ]*$/;
const TITLE: Record<ModalMode, string> = { add: 'Add', view: 'View', edit: 'Edit' };

const parseRows = (json: string): ItemValueRow[] => {
  try { return JSON.parse(json); } catch { return []; }
};

const McaPatternModal: React.FC<Props> = ({ mode, item, mcas, onClose, onSave }) => {
  const [patternId, setPatternId] = useState('');
  const [mcaId, setMcaId] = useState('');
  const [contractRows, setContractRows] = useState<ItemValueRow[]>([]);
  const [tradeRows, setTradeRows] = useState<ItemValueRow[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('contract');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readonly = mode === 'view';

  useEffect(() => {
    if (item) {
      setPatternId(item.mcaPatternId);
      setMcaId(item.mcaId);
      setContractRows(parseRows(item.contractItems));
      setTradeRows(parseRows(item.tradeItems));
      setSpecialNotes(item.specialNotes ?? '');
    } else {
      setPatternId('');
      setMcaId('');
      setContractRows([]);
      setTradeRows([]);
      setSpecialNotes('');
    }
    setActiveTab('contract');
    setError(null);
  }, [item]);

  // MCA ID selection handler: populate Contract rows from the selected MCA's contract items
  const handleMcaIdChange = (selectedMcaId: string) => {
    setMcaId(selectedMcaId);
    if (!selectedMcaId) return;
    const found = mcas.find(m => m.mcaId === selectedMcaId);
    if (!found) return;
    try {
      const names: string[] = JSON.parse(found.contractItems);
      // Merge: keep existing values for matching itemNames, add new rows for new items
      setContractRows(prev => {
        const valueMap = Object.fromEntries(prev.map(r => [r.itemName, r.value]));
        return names.map(n => ({ itemName: n, value: valueMap[n] ?? '' }));
      });
    } catch { /* ignore */ }
  };

  // ---- row helpers ----
  const addRow = (setter: React.Dispatch<React.SetStateAction<ItemValueRow[]>>) =>
    setter(prev => [...prev, { itemName: '', value: '' }]);

  const deleteRow = (setter: React.Dispatch<React.SetStateAction<ItemValueRow[]>>, idx: number) =>
    setter(prev => prev.filter((_, i) => i !== idx));

  const updateRow = (
    setter: React.Dispatch<React.SetStateAction<ItemValueRow[]>>,
    idx: number,
    field: keyof ItemValueRow,
    val: string,
  ) => setter(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patternId.trim()) { setError('MCA Pattern ID is required'); return; }
    if (!mcaId.trim()) { setError('MCA ID is required'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        mcaPatternId: patternId,
        mcaId,
        contractItems: JSON.stringify(contractRows),
        tradeItems: JSON.stringify(tradeRows),
        specialNotes: specialNotes || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---- Item/Value grid for Contract and Trade tabs ----
  const ItemValueGrid = (
    rows: ItemValueRow[],
    setter: React.Dispatch<React.SetStateAction<ItemValueRow[]>>,
  ) => (
    <div>
      <table className="iv-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Value</th>
            {!readonly && <th style={{ width: 50 }}></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  className="iv-input"
                  value={row.itemName}
                  readOnly={readonly}
                  onChange={e => updateRow(setter, i, 'itemName', e.target.value)}
                />
              </td>
              <td>
                <input
                  className="iv-input"
                  value={row.value}
                  readOnly={readonly}
                  onChange={e => updateRow(setter, i, 'value', e.target.value)}
                />
              </td>
              {!readonly && (
                <td>
                  <button type="button" style={delRowBtn} onClick={() => deleteRow(setter, i)}>✕</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!readonly && (
        <button type="button" style={addRowBtn} onClick={() => addRow(setter)}>+ Add Row</button>
      )}
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 640 }}>
        <div className="modal-header">
          <span>MCA Pattern — {TITLE[mode]}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {item && mode !== 'add' && (
          <div className="modal-uuid">UUID: <code>{item.id}</code></div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          {/* MCA Pattern ID */}
          <div className="modal-field">
            <label>MCA Pattern ID<span className="required"> *</span></label>
            <input
              value={patternId}
              readOnly={readonly}
              placeholder="Alphanumeric only"
              onChange={e => { if (ALNUM_RE.test(e.target.value)) setPatternId(e.target.value); }}
            />
          </div>

          {/* MCA ID select */}
          <div className="modal-field">
            <label>MCA ID<span className="required"> *</span></label>
            <select
              value={mcaId}
              disabled={readonly}
              onChange={e => handleMcaIdChange(e.target.value)}
            >
              <option value="">-- Select --</option>
              {mcas.map(m => <option key={m.id} value={m.mcaId}>{m.mcaId}</option>)}
            </select>
          </div>

          {/* Tabs */}
          <div className="mcp-tabs">
            {(['contract', 'trade', 'special'] as TabKey[]).map(t => (
              <button
                key={t}
                type="button"
                className={`mcp-tab${activeTab === t ? ' active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'contract' ? 'Contract' : t === 'trade' ? 'Trade' : 'Special Notes'}
              </button>
            ))}
          </div>

          <div className="mcp-tab-body">
            {activeTab === 'contract' && ItemValueGrid(contractRows, setContractRows)}
            {activeTab === 'trade'    && ItemValueGrid(tradeRows, setTradeRows)}
            {activeTab === 'special'  && (
              <textarea
                className="iv-textarea"
                value={specialNotes}
                readOnly={readonly}
                rows={8}
                placeholder="Alphanumeric and spaces only"
                onChange={e => { if (ALNUM_MULTI_RE.test(e.target.value)) setSpecialNotes(e.target.value); }}
              />
            )}
          </div>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {readonly ? 'Close' : 'Cancel'}
            </button>
            {!readonly && (
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'OK'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const addRowBtn: React.CSSProperties = {
  marginTop: 6, padding: '3px 12px', background: '#27ae60', color: '#fff',
  border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
};

const delRowBtn: React.CSSProperties = {
  padding: '2px 6px', background: '#e74c3c', color: '#fff',
  border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: '0.78rem',
};

export default McaPatternModal;
