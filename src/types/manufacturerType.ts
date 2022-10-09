export interface IManufacturerType {
    ManufacturerId?: Number,
    Name: String,
    Email: String,
    PhoneNumber: String,
    Address: String,
    Status: String
}

export const dummyManufacturerData: IManufacturerType = { 
    "ManufacturerId": -1, 
    "Name": "", 
    "Email": "", 
    "PhoneNumber": "", 
    "Address": "", 
    "Status": ""
 }