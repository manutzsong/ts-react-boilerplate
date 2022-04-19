export interface LazadaShopPhoneType {
  api: string;
  data: Data;
  ret: string[];
  v: string;
}

export interface Data {
  data: Data2;
}

export interface Data2 {
  fields: Field[];
  globalDisabled: boolean;
}

export interface Field {
  disabled: boolean;
  history: boolean;
  label: string;
  name: string;
  needOtp: boolean;
  needQc: boolean;
  uiType: string;
  value: string;
  fieldName?: string;
  required?: boolean;
  tips?: string;
  prefix?: string;
  disableHref?: string;
}
