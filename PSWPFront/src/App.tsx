import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import {
  loadContractItemPage,
  loadDashboardPage,
  loadMailSettingPage,
  loadMCAPage,
  loadMCAPatternPage,
  loadStrategyPage,
  loadSystemSettingPage,
} from './routes/pageLoaders';

const DashboardPage = lazy(loadDashboardPage);
const ContractItemPage = lazy(loadContractItemPage);
const MCAPage = lazy(loadMCAPage);
const MCAPatternPage = lazy(loadMCAPatternPage);
const MailSettingPage = lazy(loadMailSettingPage);
const StrategyPage = lazy(loadStrategyPage);
const SystemSettingPage = lazy(loadSystemSettingPage);

const pageFallback = (
  <div style={{ padding: 16, color: '#666' }}>
    Loading...
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={pageFallback}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />

          {/* Master > Definition */}
          <Route path="master/definition/contract-item" element={<ContractItemPage />} />
          <Route path="master/definition/mca"           element={<MCAPage />} />

          {/* Master */}
          <Route path="master/mca-pattern"  element={<MCAPatternPage />} />
          <Route path="master/mail-setting" element={<MailSettingPage />} />
          <Route path="master/strategy"     element={<StrategyPage />} />

          {/* System */}
          <Route path="system/setting" element={<SystemSettingPage />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
