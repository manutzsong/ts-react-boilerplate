export interface LazadaShopInfoType {
  api: string;
  data: Data;
  ret: string[];
  v: string;
}

export interface Data {
  data: Data2;
}

export interface Data2 {
  countryNationCode: string;
  email: string;
  isCrossBorder: boolean;
  isEnableO2oStoreList: boolean;
  isEnableOperationHours: boolean;
  isLazMall: boolean;
  isMulitiAddressSeller: boolean;
  isPwdEmpty: boolean;
  isWalletActive: boolean;
  masterEmail: string;
  masterNationCode: string;
  masterPhone: string;
  nationCode: string;
  phone: string;
  shopLogo: string;
  shortCode: string;
  storeName: string;
  storeUrl: string;
  userId: number;
}
