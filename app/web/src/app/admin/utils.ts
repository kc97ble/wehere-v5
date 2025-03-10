import React from "react";

export type AdminLayoutContext = {
  // allow to display a button on the right of the nav bar
  registerPrimarySlot?: (key: string, node: React.ReactNode) => void;
  unregisterPrimarySlot?: (key: string) => void;
};

export const AdminLayoutContext = React.createContext<AdminLayoutContext>({});
