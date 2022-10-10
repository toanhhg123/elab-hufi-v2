export interface ISupplierType {
    SupplierId?: Number,
    Name: String,
    Email: String,
    PhoneNumber: String,
    Address: String,
    Status: String,
    PurchaseOrders: any
}

export const dummySupplierData: ISupplierType ={
    "SupplierId":1,
    "Name":"Công ty ABC",
    "Email":"abc@gmail.com",
    "PhoneNumber":"0902334567",
    "Address":"TPHCM",
    "Status":"good",
    "PurchaseOrders":null
}