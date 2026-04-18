import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';

// AG Grid Enterprise モジュール登録
// ライセンスキーがある場合はインポートして設定:
// import { LicenseManager } from 'ag-grid-enterprise';
// LicenseManager.setLicenseKey('YOUR_LICENSE_KEY');
ModuleRegistry.registerModules([AllEnterpriseModule]);

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
