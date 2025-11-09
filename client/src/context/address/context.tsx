import {
  createContext,
} from "react";
import type { AddressContextValue } from "./types";

export const AddressContext = createContext<AddressContextValue | undefined>(undefined);
