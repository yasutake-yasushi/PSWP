import React from 'react';

interface Props { title: string; }

/** 未実装ページの共通プレースホルダー */
const PlaceholderPage: React.FC<Props> = ({ title }) => (
  <div>
    <h2 style={{ marginBottom: 12 }}>{title}</h2>
    <p style={{ color: '#888' }}>このページは現在開発中です。</p>
  </div>
);

export default PlaceholderPage;
