// src/types/NavbarTypes.ts
export interface NavbarProps {
    username?: string;
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
  }