import React, { useEffect, useState } from 'react';
import { MailSetting, MailSettingInput, AddressRow } from '../api/mailSettings';
import { MODAL_TITLES, ModalMode } from './modalShared';
import './ContractItemModal.css';
import './MailSettingModal.css';

interface Props {
  mode: ModalMode;
  item?: MailSetting;
  onClose: () => void;
  onSave: (input: MailSettingInput) => Promise<void>;
}

type TabKey = 'address' | 'message';

const EVENT_TYPES = ['OTCCross', 'StockList', 'PreConfirmation'];
const ADDRESS_KINDS: AddressRow['kind'][] = ['To', 'CC', 'BCC'];
const ALNUM_RE = /^[A-Za-z0-9]*$/;
const parseAddresses = (json: string): AddressRow[] => {
  try { return JSON.parse(json); } catch { return []; }
};

const MailSettingModal: React.FC<Props> = ({ mode, item, onClose, onSave }) => {
  const [eventType, setEventType]   = useState('');
  const [templateId, setTemplateId] = useState('');
  const [description, setDescription] = useState('');
  const [addresses, setAddresses]   = useState<AddressRow[]>([]);
  const [message, setMessage]       = useState('');
  const [activeTab, setActiveTab]   = useState<TabKey>('address');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const readonly = mode === 'view';

  useEffect(() => {
    if (item) {
      setEventType(item.eventType);
      setTemplateId(item.templateId);
      setDescription(item.description ?? '');
      setAddresses(parseAddresses(item.addresses));
      setMessage(item.message ?? '');
    } else {
      setEventType('');
      setTemplateId('');
      setDescription('');
      setAddresses([]);
      setMessage('');
    }
    setActiveTab('address');
    setError(null);
  }, [item]);

  // ---- address row helpers ----
  const addAddressRow = () =>
    setAddresses(prev => [...prev, { kind: 'To', address: '' }]);

  const deleteAddressRow = (idx: number) =>
    setAddresses(prev => prev.filter((_, i) => i !== idx));

  const updateAddressRow = (idx: number, field: keyof AddressRow, val: string) =>
    setAddresses(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType) { setError('Event Type is required'); return; }
    if (!templateId.trim()) { setError('Template ID is required'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        eventType,
        templateId,
        description,
        addresses: JSON.stringify(addresses),
        message,
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 600 }}>
        <div className="modal-header">
          <span>Mail Setting — {MODAL_TITLES[mode]}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {item && mode !== 'add' && (
          <div className="modal-uuid">ID: <code>{item.id}</code></div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Event Type */}
          <div className="modal-field">
            <label>Event Type<span className="required"> *</span></label>
            <select
              value={eventType}
              disabled={readonly}
              onChange={e => setEventType(e.target.value)}
            >
              <option value="">-- Select --</option>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Template ID */}
          <div className="modal-field">
            <label>Template ID<span className="required"> *</span></label>
            <input
              value={templateId}
              readOnly={readonly}
              placeholder="Alphanumeric only"
              onChange={e => { if (ALNUM_RE.test(e.target.value)) setTemplateId(e.target.value); }}
            />
          </div>

          {/* Description */}
          <div className="modal-field">
            <label>Description</label>
            <input
              value={description}
              readOnly={readonly}
              placeholder="Description"
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="ms-tabs">
            {(['address', 'message'] as TabKey[]).map(t => (
              <button
                key={t}
                type="button"
                className={`ms-tab${activeTab === t ? ' active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'address' ? 'Address' : 'Message'}
              </button>
            ))}
          </div>

          <div className="ms-tab-body">
            {activeTab === 'address' && (
              <div>
                <table className="ms-addr-table">
                  <thead>
                    <tr>
                      <th style={{ width: 100 }}>Kind</th>
                      <th>Address</th>
                      {!readonly && <th style={{ width: 50 }}></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {addresses.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <select
                            className="ms-input"
                            value={row.kind}
                            disabled={readonly}
                            onChange={e => updateAddressRow(i, 'kind', e.target.value as AddressRow['kind'])}
                          >
                            {ADDRESS_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            className="ms-input"
                            type="email"
                            value={row.address}
                            readOnly={readonly}
                            placeholder="user@example.com"
                            onChange={e => updateAddressRow(i, 'address', e.target.value)}
                          />
                        </td>
                        {!readonly && (
                          <td>
                            <button
                              type="button"
                              style={delRowBtn}
                              onClick={() => deleteAddressRow(i)}
                            >✕</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!readonly && (
                  <button type="button" style={addRowBtn} onClick={addAddressRow}>+ Add Row</button>
                )}
              </div>
            )}

            {activeTab === 'message' && (
              <textarea
                className="ms-textarea"
                value={message}
                readOnly={readonly}
                rows={10}
                placeholder="Email message template..."
                onChange={e => setMessage(e.target.value)}
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

export default MailSettingModal;
