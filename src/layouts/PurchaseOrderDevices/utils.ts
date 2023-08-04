export const ObjAccept: { [key in string]: string } = {
  "Trưởng phòng QTTB": "Chờ xác nhận cấp trưởng phòng QTTB",
  "Chuyên viên đơn vị sử dụng":
    "Chờ xác nhận cấp chuyên viên phụ trách tại đơn vị",
  "Trưởng đơn vị sử dụng": "Chờ xác nhận cấp trưởng đơn vị",
};

export const DeviceEditing = "Chờ chỉnh sửa";

export const matchAccept = (key: string, value: string) => {
  return ObjAccept[key] === value;
};

export const nextStatus: { [key in string]: string } = {
  "Chờ xác nhận cấp trưởng phòng QTTB":
    "Chờ xác nhận cấp chuyên viên phụ trách tại đơn vị",
  "Chờ xác nhận cấp chuyên viên phụ trách tại đơn vị":
    "Chờ xác nhận cấp trưởng đơn vị",

  "Chờ xác nhận cấp trưởng đơn vị": "Đã nhập kho",
};
