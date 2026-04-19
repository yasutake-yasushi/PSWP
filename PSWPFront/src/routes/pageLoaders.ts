export const loadDashboardPage = () => import('../pages/DashboardPage');
export const loadContractItemPage = () => import('../pages/ContractItemPage');
export const loadMCAPage = () => import('../pages/MCAPage');
export const loadMCAPatternPage = () => import('../pages/MCAPatternPage');
export const loadMailSettingPage = () => import('../pages/MailSettingPage');
export const loadStrategyPage = () => import('../pages/StrategyPage');
export const loadSystemSettingPage = () => import('../pages/SystemSettingPage');

const prefetchers: Record<string, () => Promise<unknown>> = {
  '/': loadDashboardPage,
  '/master/definition/contract-item': loadContractItemPage,
  '/master/definition/mca': loadMCAPage,
  '/master/mca-pattern': loadMCAPatternPage,
  '/master/mail-setting': loadMailSettingPage,
  '/master/strategy': loadStrategyPage,
  '/system/setting': loadSystemSettingPage,
};

const prefetchedPaths = new Set<string>();

export function prefetchRouteChunk(path: string): void {
  if (prefetchedPaths.has(path)) {
    return;
  }

  const loader = prefetchers[path];
  if (!loader) {
    return;
  }

  prefetchedPaths.add(path);
  void loader();
}
