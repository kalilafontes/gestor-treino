/// <reference types="vite/client" />

interface Window {
  __setPrismaMockScenario?: (
    input: Partial<import('@/services/mocks/scenario').MockScenario>,
  ) => void;
}
