import { useContext } from "react";
import {type AddressContextValue } from "./types";
import { AddressContext } from "./context";

export function useAddressSearch(): AddressContextValue {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddressSearch must be used within a AddressContextProvider");
  }
  return context;
}