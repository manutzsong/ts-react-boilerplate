export interface LazadaAddressType {
    api: string
    data: Data
    ret: string[]
    v: string
  }
  
  export interface Data {
    data: Data2
  }
  
  export interface Data2 {
    fields: Field[]
    globalDisabled: boolean
  }
  
  export interface Field {
    disabled: boolean
    history: boolean
    label: string
    name: string
    needOtp: boolean
    needQc: boolean
    uiType: string
    value: any
    fieldName?: string
    required?: boolean
    priority?: number
    tips?: string
    accept?: string
    limit?: number
    maxSize?: number
    dataSource?: DataSource[]
    iso?: string
  }
  
  export interface DataSource {
    label: string
    value: string
  }
  