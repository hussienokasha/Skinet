export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  address: Address;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
