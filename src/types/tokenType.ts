export interface IToken {
  AccessToken: String;
  RefreshToken: String;
  UserName: String;
  type: String;
}

export const dummyToken: IToken = {
  AccessToken: "",
  RefreshToken: "",
  UserName: "",
  type: "",
};
