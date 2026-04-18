import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const nav = [
  { to: '/', label: 'ダッシュボード', icon: '🏠' },
  { to: '/users', label: 'ユーザー管理', icon: '👤' },
];

const Layout: React.FC = () => (
  <div className="layout">
    <aside className="sidebar">
      <div className="sidebar-title">PSWP</div>
      <nav>
        {nav.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="content">
      <Outlet />
    </main>
  </div>
);

export default Layout;
