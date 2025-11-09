import { getAddress } from "@/lib/getAddress";
import {
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { AddressItem } from "./types";
import { AddressContext } from "./context";

export function AddressContextProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchAddress = (input: string) => {
    startTransition(async () => {
      const result = await getAddress<AddressItem[]>(input);
      setAddresses(result);
    });
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        fetchAddress,
        isLoading: isPending,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}
