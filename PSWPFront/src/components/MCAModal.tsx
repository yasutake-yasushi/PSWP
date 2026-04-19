import React, { useEffect, useState } from 'react';
import { MCA, MCAInput } from '../api/mcas';
import ContractItemSelector from './ContractItemSelector';
import { MODAL_TITLES, ModalMode } from './modalShared';
import './ContractItemModal.css'; // reuse same CSS

interface Props {
  mode: ModalMode;
  item?: MCA;
  onClose: () => void;
  onSave: (input: MCAInput) => Promise<void>;
}

const EMPTY: MCAInput = {
  mcaId: '',
  cpty: '',
  agreementDate: null,
  executionDate: null,
  contractItems: '[]',
};

const ALNUM_RE = /^[A-Za-z0-9]*$/;

const MCAModal: React.FC<Props> = ({ mode, item, onClose, onSave }) => {
  const [form, setForm] = useState<MCAInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const readonly = mode === 'view';

  useEffect(() => {
    if (item) {
      setForm({
        mcaId: item.mcaId,
        cpty: item.cpty,
        agreementDate: item.agreementDate ?? null,
        executionDate: item.executionDate ?? null,
        contractItems: item.contractItems,
      });
    } else {
      setForm(EMPTY);
    }
  }, [item]);

  const handleChange = (field: keyof MCAInput, value: string | null) => {
    if ((field === 'mcaId' || field === 'cpty') && typeof value === 'string') {
      if (!ALNUM_RE.test(value)) return;
    }
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mcaId.trim()) { setError('MCA ID is required'); return; }
    if (!form.cpty.trim()) { setError('CPTY is required'); return; }
    setSaving(true);
    setError(null);
    let closeAfterSave = false;
    try {
      await onSave(form);
      closeAfterSave = true;
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!closeAfterSave) {
        setSaving(false);
      }
    }
  };

  const selectedNames: string[] = (() => {
    try { return JSON.parse(form.contractItems); } catch { return []; }
  })();

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <div className="modal-header">
            <span>MCA — {MODAL_TITLES[mode]}</span>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          {item && mode !== 'add' && (
            <div className="modal-uuid">ID: <code>{item.id}</code></div>
          )}

          <form onSubmit={handleSubmit} className="modal-body">
            <Field label="MCA ID" required>
              <input
                value={form.mcaId}
                onChange={e => handleChange('mcaId', e.target.value)}
                readOnly={readonly}
                placeholder="Alphanumeric only"
              />
            </Field>

            <Field label="CPTY" required>
              <input
                value={form.cpty}
                onChange={e => handleChange('cpty', e.target.value)}
                readOnly={readonly}
                placeholder="Alphanumeric only"
              />
            </Field>

            <Field label="Agreement Date">
              <input
                type="date"
                value={form.agreementDate ?? ''}
                onChange={e => handleChange('agreementDate', e.target.value || null)}
                readOnly={readonly}
              />
            </Field>

            <Field label="Execution Date">
              <input
                type="date"
                value={form.executionDate ?? ''}
                onChange={e => handleChange('executionDate', e.target.value || null)}
                readOnly={readonly}
              />
            </Field>

            <Field label="Contract Item">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={contractItemBox}>
                  {selectedNames.length === 0
                    ? <span style={{ color: '#aaa', fontSize: '0.83rem' }}>— none —</span>
                    : selectedNames.map(n => (
                        <div key={n} style={{ fontSize: '0.85rem', padding: '2px 0' }}>{n}</div>
                      ))
                  }
                </div>
                {!readonly && (
                  <button
                    type="button"
                    style={editBtn}
                    onClick={() => setShowSelector(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </Field>

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

      {showSelector && (
        <ContractItemSelector
          selected={selectedNames}
          onClose={() => setShowSelector(false)}
          onOk={names => {
            setForm(f => ({ ...f, contractItems: JSON.stringify(names) }));
            setShowSelector(false);
          }}
        />
      )}
    </>
  );
};

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="modal-field">
    <label>{label}{required && <span className="required"> *</span>}</label>
    {children}
  </div>
);

const contractItemBox: React.CSSProperties = {
  flex: 1, minHeight: 60, maxHeight: 120, overflowY: 'auto',
  border: '1px solid #d0d5dd', borderRadius: 4, padding: '4px 8px',
  background: '#fafafa',
};

const editBtn: React.CSSProperties = {
  padding: '4px 12px', background: '#4e9af1', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600,
};

export default MCAModal;
