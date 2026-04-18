import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ContractItemPage from './pages/ContractItemPage';
import McaPage from './pages/McaPage';
import McaPatternPage from './pages/McaPatternPage';
import MailSettingPage from './pages/MailSettingPage';
import PlaceholderPage from './pages/PlaceholderPage';

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

        {/* Master > Definition */}
        <Route path="master/definition/contract-item" element={<ContractItemPage />} />
        <Route path="master/definition/mca"           element={<McaPage />} />

        {/* Master */}
        <Route path="master/mca-pattern"  element={<McaPatternPage />} />
        <Route path="master/mail-setting" element={<MailSettingPage />} />
        <Route path="master/strategy"     element={<PlaceholderPage title="Strategy" />} />

        {/* System */}
        <Route path="system/setting" element={<PlaceholderPage title="System Setting" />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
