import React from 'react';
import './ConfirmDialog.css';

interface Props {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmDialog: React.FC<Props> = ({ title, message, onCancel, onConfirm, loading }) => (
  <div className="modal-overlay">
    <div className="confirm-box">
      <div className="confirm-header">{title}</div>
      <div className="confirm-body">
        {message.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="confirm-footer">
        <button className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
