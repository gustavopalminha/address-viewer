import { AddressForm } from "./Form"
import { AddressList } from "./List";

const Address = () => (
    <div data-testid="address-ui">
        <AddressForm />
        <AddressList />
    </div>
)

export {Address};