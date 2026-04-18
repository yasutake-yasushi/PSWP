import React, { useEffect, useState } from 'react';
import { getContractItems } from '../api/contractItems';

interface Props {
  selected: string[];          // Currently selected item names
  onClose: () => void;
  onOk: (selected: string[]) => void;
}

const ContractItemSelector: React.FC<Props> = ({ selected, onClose, onOk }) => {
  const [allItems, setAllItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([...selected]);
  const [leftSel, setLeftSel] = useState<string[]>([]);
  const [rightSel, setRightSel] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContractItems()
      .then(items => setAllItems(items.map(i => i.itemName)))
      .catch(() => setAllItems([]))
      .finally(() => setLoading(false));
  }, []);

  const leftItems = allItems.filter(n => !rightItems.includes(n));

  const moveToRight = () => {
    if (!leftSel.length) return;
    setRightItems(prev => [...prev, ...leftSel]);
    setLeftSel([]);
  };

  const moveToLeft = () => {
    if (!rightSel.length) return;
    setRightItems(prev => prev.filter(n => !rightSel.includes(n)));
    setRightSel([]);
  };

  const toggleLeft = (name: string) =>
    setLeftSel(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  const toggleRight = (name: string) =>
    setRightSel(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 640 }}>
        <div className="modal-header">
          <span>Select Contract Items</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: 12, padding: '16px', alignItems: 'flex-start' }}>
          {/* Left list — Contract Item */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={listTitle}>Contract Item</div>
            <div style={listBox}>
              {loading
                ? <div style={{ padding: 8, color: '#999' }}>Loading...</div>
                : leftItems.map(name => (
                    <div
                      key={name}
                      style={listItem(leftSel.includes(name))}
                      onClick={() => toggleLeft(name)}
                    >
                      {name}
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Arrow buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, paddingTop: 36 }}>
            <button style={arrowBtn} onClick={moveToRight} title="Add selected">▶</button>
            <button style={arrowBtn} onClick={moveToLeft} title="Remove selected">◀</button>
          </div>

          {/* Right list — Selected */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={listTitle}>Selected</div>
            <div style={listBox}>
              {rightItems.map(name => (
                <div
                  key={name}
                  style={listItem(rightSel.includes(name))}
                  onClick={() => toggleRight(name)}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '8px 16px' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onOk(rightItems)}>OK</button>
        </div>
      </div>
    </div>
  );
};

const listTitle: React.CSSProperties = {
  fontWeight: 600, fontSize: '0.85rem', color: '#444',
};

const listBox: React.CSSProperties = {
  border: '1px solid #d0d5dd', borderRadius: 4, height: 260,
  overflowY: 'auto', background: '#fafafa',
};

const listItem = (selected: boolean): React.CSSProperties => ({
  padding: '5px 10px', cursor: 'pointer', fontSize: '0.85rem',
  background: selected ? '#dbeafe' : 'transparent',
  borderBottom: '1px solid #eee',
  userSelect: 'none',
});

const arrowBtn: React.CSSProperties = {
  padding: '6px 10px', background: '#4e9af1', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
};

export default ContractItemSelector;
