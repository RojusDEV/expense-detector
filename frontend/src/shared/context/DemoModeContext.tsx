import { createContext, useContext } from "react";

const DemoModeContext = createContext(false);

export const DemoModeProvider = ({ children }: { children: React.ReactNode }) => (
  <DemoModeContext.Provider value={true}>{children}</DemoModeContext.Provider>
);

export const useIsDemoMode = () => useContext(DemoModeContext);