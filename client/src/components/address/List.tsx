import { useAddressSearch } from "@/context/address/hooks";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { List, MapPinHouse } from "lucide-react"
import { Loading } from "../loading";

const FriendlyDisclaimer = () => {
  return (
    <Empty data-testid="friendly-disclaimer">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <List />
        </EmptyMedia>
        <EmptyTitle>No Addresses yet</EmptyTitle>
        <EmptyDescription>
          <p>You need to type 3 characters to try fetching addresses.</p>
          <p>In case no results, after fetching, this area will be empty.</p>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export const AddressList = () => {
    const {addresses, isLoading} = useAddressSearch();

    if(addresses.length < 1) return <FriendlyDisclaimer />;
    
    if(isLoading) return <Loading label={'Fetching street data...'} />;

    return (
      <>
        <ul className="w-full max-w-md border rounded-md divide-y mt-5" data-testid="address-list">
          {addresses.map((address, i) => (
            {/*CR: Changed the key for better rendering handling */}
            <li key={`${address.street}-${address.postNumber}-${i}`} className="p-3 text-sm">
              <Card>
                <CardHeader>
                  <CardTitle>{address.street}</CardTitle>
                  <CardDescription>
                    <p>Post Number: {address.postNumber}</p>
                    <p className="flex pt-1"><MapPinHouse/> <span className="pl-2 pt-2">{address.city}</span></p>
                  </CardDescription>
                </CardHeader>              
              </Card>
            </li>
          ))}
        </ul>
      </>
    )
}