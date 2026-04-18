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
  <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
    <div className="confirm-box">
      <div className="confirm-header">{title}</div>
      <div className="confirm-body">
        {message.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="confirm-footer">
        <button className="btn-secondary" onClick={onCancel} disabled={loading}>キャンセル</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? '削除中...' : '削除する'}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
