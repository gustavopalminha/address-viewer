export type AddressItem = {
  city: string;
  county: string;
  district: string;
  municipality: string;
  municipalityNumber: string;
  postNumber: string;
  street: string;
  type: string;
  typeCode: string;
}

export type AddressContextValue = {
  addresses: AddressItem[];
  isLoading: boolean;
  fetchAddress: (input: string) => void;
};