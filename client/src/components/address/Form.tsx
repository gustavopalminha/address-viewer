import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddressSearch } from "@/context/address/hooks";
import { useDebouncedCallback } from "@/hooks/useDebouceCallback";

export const AddressForm = () => {
    const {fetchAddress, isLoading} = useAddressSearch();

    const performSearch = (address: string) => {
        if (address && address.length >= 3 && !isLoading) {
            fetchAddress(address);
        }
    };

    const getAddressFromEvent = (evt: React.FormEvent<HTMLFormElement>): string => {
        const formData = new FormData(evt.currentTarget);
        return formData.get('address') as string;
    };

    const handlerSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const address = getAddressFromEvent(evt);
        performSearch(address);
    }

    const handlerChange = (evt: React.FormEvent<HTMLFormElement>) => {
        const address = getAddressFromEvent(evt);
        debouncedFetchAddress(address);
    }

    const debouncedFetchAddress = useDebouncedCallback(performSearch, 800);

    return (
        <form onSubmit={handlerSubmit} onChange={handlerChange}>
            <div className="flex gap-2 w-full max-w-md">
                <Input placeholder="Enter address..." name="address" />
                <Button disabled={isLoading}>Submit</Button>
            </div>            
        </form>
    )
}