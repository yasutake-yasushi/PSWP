import React, { useEffect, useState } from 'react';
import { Strategy, StrategyInput } from '../api/strategies';
import { MODAL_TITLES, ModalMode } from './modalShared';
import './ContractItemModal.css';

interface Props {
  mode: ModalMode;
  item?: Strategy;
  onClose: () => void;
  onSave: (input: StrategyInput) => Promise<void>;
}

const STRATEGY_TYPES = ['Lending', 'Borrowing', 'Funding', 'Self Funding'];
const StrategyModal: React.FC<Props> = ({ mode, item, onClose, onSave }) => {
  const [strategyType, setStrategyType] = useState('');
  const [portId, setPortId]             = useState('');
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const readonly = mode === 'view';

  useEffect(() => {
    if (item) {
      setStrategyType(item.strategyType);
      setPortId(item.portId);
    } else {
      setStrategyType('');
      setPortId('');
    }
    setError(null);
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategyType) { setError('Strategy is required'); return; }
    if (!portId.trim()) { setError('Port ID is required'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave({ strategyType, portId });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 440 }}>
        <div className="modal-header">
          <span>Strategy — {MODAL_TITLES[mode]}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {item && mode !== 'add' && (
          <div className="modal-uuid">ID: <code>{item.id}</code></div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Strategy */}
          <div className="modal-field">
            <label>Strategy<span className="required"> *</span></label>
            <select
              value={strategyType}
              disabled={readonly}
              onChange={e => setStrategyType(e.target.value)}
            >
              <option value="">-- Select --</option>
              {STRATEGY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Port ID */}
          <div className="modal-field">
            <label>Port ID<span className="required"> *</span></label>
            <input
              value={portId}
              readOnly={readonly}
              placeholder="Port ID"
              onChange={e => setPortId(e.target.value)}
            />
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

export default StrategyModal;
