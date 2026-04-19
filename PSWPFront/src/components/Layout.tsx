import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { prefetchRouteChunk } from '../routes/pageLoaders';
import './Layout.css';

type LeafItem = { label: string; to: string };
type GroupItem = { label: string; children: NavItem[] };
type NavItem = LeafItem | GroupItem;

const isGroup = (item: NavItem): item is GroupItem => 'children' in item;

const navTree: { section: string; items: NavItem[] }[] = [
  {
    section: 'Master',
    items: [
      {
        label: 'Definition',
        children: [
          { label: 'Contract Item', to: '/master/definition/contract-item' },
          { label: 'MCA',          to: '/master/definition/mca' },
        ],
      },
      { label: 'MCA Pattern',  to: '/master/mca-pattern' },
      { label: 'Mail Setting', to: '/master/mail-setting' },
      { label: 'Strategy',     to: '/master/strategy' },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'System Setting', to: '/system/setting' },
    ],
  },
];

/** すべてのリーフパスを収集 */
function collectPaths(items: NavItem[]): string[] {
  return items.flatMap(item =>
    isGroup(item) ? collectPaths(item.children) : [item.to]
  );
}

/** パスがグループ配下かどうか */
function groupContainsPath(item: GroupItem, pathname: string): boolean {
  return collectPaths(item.children).some(p => pathname.startsWith(p));
}

const NavTree: React.FC<{ items: NavItem[]; depth?: number }> = ({ items, depth = 0 }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    items.forEach(item => {
      if (isGroup(item) && groupContainsPath(item, pathname)) {
        init[item.label] = true;
      }
    });
    return init;
  });

  return (
    <>
      {items.map(item => {
        if (isGroup(item)) {
          const expanded = !!open[item.label];
          const hasActive = groupContainsPath(item, pathname);
          return (
            <div key={item.label}>
              <button
                className={`nav-group depth-${depth}${hasActive ? ' has-active' : ''}`}
                onClick={() => setOpen(o => ({ ...o, [item.label]: !o[item.label] }))}
              >
                <span className="nav-caret">{expanded ? '▾' : '▸'}</span>
                {item.label}
              </button>
              {expanded && (
                <div className="nav-children">
                  <NavTree items={item.children} depth={depth + 1} />
                </div>
              )}
            </div>
          );
        }
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onMouseEnter={() => prefetchRouteChunk(item.to)}
            onFocus={() => prefetchRouteChunk(item.to)}
            className={({ isActive }) =>
              `nav-leaf depth-${depth}${isActive ? ' active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        );
      })}
    </>
  );
};

const Layout: React.FC = () => (
  <div className="layout">
    <aside className="sidebar">
      <div className="sidebar-title">PSWP</div>
      <nav>
        {navTree.map(({ section, items }) => (
          <div key={section} className="nav-section">
            <div className="nav-section-label">{section}</div>
            <NavTree items={items} depth={0} />
          </div>
        ))}
      </nav>
    </aside>
    <main className="content">
      <Outlet />
    </main>
  </div>
);

export default Layout;
