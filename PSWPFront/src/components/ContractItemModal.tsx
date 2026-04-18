import React, { useEffect, useState } from 'react';
import { ContractItem, ContractItemInput } from '../api/contractItems';
import './ContractItemModal.css';

export type ModalMode = 'add' | 'view' | 'edit';

interface Props {
  mode: ModalMode;
  item?: ContractItem;
  onClose: () => void;
  onSave: (input: ContractItemInput) => Promise<void>;
}

const EMPTY: ContractItemInput = {
  category: '',
  itemName: '',
  dataType: 'string',
  values: '',
  defaultValue: '',
  description: '',
};

const DATA_TYPES = ['string', 'number', 'boolean', 'date', 'datetime', 'list'];

const TITLE: Record<ModalMode, string> = {
  add: '行追加',
  view: '参照',
  edit: '更新',
};

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
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category.trim()) { setError('Category は必須です'); return; }
    if (!form.itemName.trim()) { setError('Item Name は必須です'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <span>Contract Item — {TITLE[mode]}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {item && mode !== 'add' && (
          <div className="modal-uuid">UUID: <code>{item.id}</code></div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          <Field label="Category" required>
            <input
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              readOnly={readonly}
              placeholder="例) General"
            />
          </Field>

          <Field label="Item Name" required>
            <input
              value={form.itemName}
              onChange={e => handleChange('itemName', e.target.value)}
              readOnly={readonly}
              placeholder="例) PaymentTerm"
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
            <input
              value={form.values ?? ''}
              onChange={e => handleChange('values', e.target.value)}
              readOnly={readonly}
              placeholder="例) Net30,Net60,Net90"
            />
          </Field>

          <Field label="Default Value">
            <input
              value={form.defaultValue ?? ''}
              onChange={e => handleChange('defaultValue', e.target.value)}
              readOnly={readonly}
              placeholder="例) Net30"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description ?? ''}
              onChange={e => handleChange('description', e.target.value)}
              readOnly={readonly}
              rows={3}
              placeholder="説明を入力"
            />
          </Field>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {readonly ? '閉じる' : 'キャンセル'}
            </button>
            {!readonly && (
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? '保存中...' : '保存'}
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
