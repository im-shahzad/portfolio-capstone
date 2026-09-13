"use client";

import { createContext, useContext } from "react";

// Lets a small client island (EnterChatButton) deep inside the
// server-rendered Hero trigger the hero/chat view switch owned by
// PortfolioExperience, without Hero itself needing to be a client
// component or thread an onClick prop down from the server.
export const EnterChatContext = createContext<(() => void) | null>(null);

export function useEnterChat() {
  const enterChat = useContext(EnterChatContext);
  if (!enterChat) {
    throw new Error("useEnterChat must be used within PortfolioExperience");
  }
  return enterChat;
}
