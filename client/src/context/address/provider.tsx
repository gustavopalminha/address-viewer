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

  //CR: included error handling logic here
  const fetchAddress = (input: string) => {
    startTransition(async () => {
      try {
        const result = await getAddress<AddressItem[]>(input);
        setAddresses(result);    
      } catch (error) {
        console.error('Failed to fetch address:', error);
      }
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
