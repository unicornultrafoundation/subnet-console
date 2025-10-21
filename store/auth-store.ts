import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  setWallet: (wallet: Partial<WalletState>) => void;
  clearWallet: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
      isLoading: false,
      error: null,

      setWallet: (wallet) => set((state) => ({ ...state, ...wallet })),

      clearWallet: () =>
        set({
          address: null,
          isConnected: false,
          chainId: null,
          balance: null,
          isLoading: false,
          error: null,
        }),

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
        chainId: state.chainId,
        balance: state.balance,
      }),
    },
  ),
);
