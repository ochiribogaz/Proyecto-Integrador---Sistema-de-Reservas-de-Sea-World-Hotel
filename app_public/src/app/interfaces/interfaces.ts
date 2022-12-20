export interface User{
    _id?: string;
    email: string;
    name: string;
    lastname: string;
    role: string;
    lastAccess?: string;
}

export interface Customer {
  _id: string;
  customerId: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  province: string;
}

export interface BookingRoom{
  room: number;
  numAdults?: number;
  numChildren?: number;
}

export interface Booking{
  _id?:string;
  checkIn: string;
  checkOut: string;
  customer: string;
  state: string;
  type: string;
  rooms: BookingRoom[];
  paymentMethod: string;
  discountPercentage: number;
  totalPrice: number;
  roomList?: any[];
  totalAdults?: number;
  totalChildren?: number;
}



export interface Room{
  _id?: string;
  roomNumber: number;
  roomType: string;
  floor: string;
}

export interface CompleteRoom{
  _id:string;
  roomNumber: number;
  roomType: RoomType[];
  floor: string;
}

export interface OccupiedRoom{
  _id:string;
  rooms: BookingRoom[];
}

export interface RoomType{
  _id: string;
  price: number;
  roomCategory: string;
  roomSize: string;
  amenities: string[];
  capacity: number;
  imageUrl: string;
  rooms?: string[];
}

export interface Route {
  path: string;
  roles: [string];
}

export interface Payment{
  Amount: number;
  AmountWithoutTax: number;
  clientTransactionId: string;
  phoneNumber: string;
  countryCode: string;
  email: string;
  documentId: string;
}

export interface Transaction{
  transactionId: number;
}

export interface PayphoneResponse{
  statusCode: number;
}

export interface CustomerAndBooking{
  customerId: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  checkIn: string;
  checkOut: string;
  customer: string;
  state: string;
  type: string;
  rooms: BookingRoom[];
  paymentMethod: string;
  discountPercentage: number;
  totalPrice: number;
}