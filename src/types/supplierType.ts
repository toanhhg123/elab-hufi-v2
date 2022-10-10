export interface ISupplierType {
    SupplierId?: Number,
    Name: String,
    Email: String,
    PhoneNumber: String,
    Address: String,
    Status: String,
    PurchaseOrders: any
}

export const dummySupplierData: ISupplierType = {
    "SupplierId": -1,
    "Name": "",
    "Email": "",
    "PhoneNumber": "",
    "Address": "",
    "Status": "",
    "PurchaseOrders": null
}