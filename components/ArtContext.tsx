"use client";

import { createContext, useContext } from "react";

const Ctx = createContext<Record<string, string>>({});

export function ArtProvider({ art, children }: { art: Record<string, string>; children: React.ReactNode }) {
  return <Ctx.Provider value={art}>{children}</Ctx.Provider>;
}

export const useArt = () => useContext(Ctx);
