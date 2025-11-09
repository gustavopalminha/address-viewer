import type { AddressItem } from "../../types";

export const MOCK_ADDRESSES: AddressItem[] = [
{
        postNumber: '0101', 
        street: '1 Main St',
        city: 'Oslo',
        county: 'Oslo',
        district: 'Sentrum',
        municipality: 'Oslo',
        municipalityNumber: '0301',
        type: 'Gateadresse',
        typeCode: 'G'
    },
    {
        postNumber: '5001', 
        street: '2 Oak Ave',
        city: 'Bergen',
        county: 'Vestland',
        district: 'Sentrum',
        municipality: 'Bergen',
        municipalityNumber: '4601',
        type: 'Gateadresse',
        typeCode: 'G'
    },
    {
        postNumber: '7001', 
        street: '3 Pine Ln',
        city: 'Trondheim',
        county: 'Trøndelag',
        district: 'Midtbyen',
        municipality: 'Trondheim',
        municipalityNumber: '5001',
        type: 'Postboks',
        typeCode: 'P'
    },
  ];