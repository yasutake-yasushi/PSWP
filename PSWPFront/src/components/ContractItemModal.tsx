import React, { useEffect, useState } from 'react';
import { ContractItem, ContractItemInput } from '../api/contractItems';
import { MODAL_TITLES, ModalMode } from './modalShared';
import './ContractItemModal.css';

interface Props {
  mode: ModalMode;
  item?: ContractItem;
  onClose: () => void;
  onSave: (input: ContractItemInput) => Promise<void>;
}

const EMPTY: ContractItemInput = {
  category: '',
  itemName: '',
  dataType: 'String',
  values: '',
  defaultValue: '',
  description: '',
};

const CATEGORIES = ['Contract', 'Trade', 'CFRoll', 'Equity', 'Interest'];
const DATA_TYPES = ['String', 'Date', 'Int', 'Number', 'Bool', 'Enum'];

// 英数字のみ許可
const ALNUM_RE = /^[A-Za-z0-9]*$/;
// 英数字・カンマ・改行のみ許可（Values用）
const ALNUM_MULTI_RE = /^[A-Za-z0-9\n,]*$/;

const ContractItemModal: React.FC<Props> = ({ mode, item, onClose, onSave }) => {
  const [form, setForm] = useState<ContractItemInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readonly = mode === 'view';

  useEffect(() => {
    if (item) {
      setForm({
        category: item.category,
        itemName: item.itemName,
        dataType: item.dataType,
        values: item.values ?? '',
        defaultValue: item.defaultValue ?? '',
        description: item.description ?? '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [item]);

  const handleChange = (field: keyof ContractItemInput, value: string) => {
    // 英数字のみ許可するフィールドのバリデーション
    if (field === 'itemName' || field === 'defaultValue') {
      if (!ALNUM_RE.test(value)) return;
    }
    if (field === 'values') {
      if (!ALNUM_MULTI_RE.test(value)) return;
    }
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category.trim()) { setError('Category is required'); return; }
    if (!form.itemName.trim()) { setError('Item Name is required'); return; }
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

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <span>Contract Item — {MODAL_TITLES[mode]}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {item && mode !== 'add' && (
          <div className="modal-uuid">ID: <code>{item.id}</code></div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          <Field label="Category" required>
            <select
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              disabled={readonly}
            >
              <option value="">-- Select --</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Item Name" required>
            <input
              value={form.itemName}
              onChange={e => handleChange('itemName', e.target.value)}
              readOnly={readonly}
              placeholder="英数字のみ (例: PaymentTerm)"
            />
          </Field>

          <Field label="Data Type" required>
            <select
              value={form.dataType}
              onChange={e => handleChange('dataType', e.target.value)}
              disabled={readonly}
            >
              {DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Values">
            <textarea
              value={form.values ?? ''}
              onChange={e => handleChange('values', e.target.value)}
              readOnly={readonly}
              rows={3}
              placeholder="英数字のみ (複数行入力可)"
            />
          </Field>

          <Field label="Default Value">
            <input
              value={form.defaultValue ?? ''}
              onChange={e => handleChange('defaultValue', e.target.value)}
              readOnly={readonly}
              placeholder="英数字のみ (例: Net30)"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description ?? ''}
              onChange={e => handleChange('description', e.target.value)}
              readOnly={readonly}
              rows={3}
              placeholder="Enter description"
            />
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
  );
};

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="modal-field">
    <label>{label}{required && <span className="required"> *</span>}</label>
    {children}
  </div>
);

export default ContractItemModal;
