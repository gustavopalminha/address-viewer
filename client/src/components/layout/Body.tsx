import { Address } from "@/components/address";
import { AddressContextProvider } from "@/context/address/provider";

export const Body = () => {
  return (
    <AddressContextProvider>
      <main className="flex-1 flex flex-col items-center justify-start p-8 gap-6">
        <Address />
      </main>
    </AddressContextProvider>
  );
};
