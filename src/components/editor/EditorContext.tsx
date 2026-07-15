"use client";

import { createContext, useContext } from "react";
import { Block, SignatureDoc } from "@/lib/blocks";

export interface EditorApi {
  doc: SignatureDoc;
  selectedId: string | null;
  select: (id: string | null) => void;
  update: (id: string, patch: Record<string, unknown>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  move: (blockId: string, containerId: string, index: number) => void;
  addBlock: (type: Block["type"], containerId: string, index: number) => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
}

export const EditorCtx = createContext<EditorApi | null>(null);

export function useEditor(): EditorApi {
  const v = useContext(EditorCtx);
  if (!v) throw new Error("EditorCtx not available");
  return v;
}
