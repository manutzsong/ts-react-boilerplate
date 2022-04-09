export interface LazadaPrintLabel {
    api: string
    data: Data
    ret: string[]
    v: string
  }
  
  export interface Data {
    data: Daum[]
    type: string
  }
  
  export interface Daum {
    eventParams: EventParams
    eventType: string
  }
  
  export interface EventParams {
    patchs: Patch[]
  }
  
  export interface Patch {
    name: string
    pages: string[]
    visible: boolean
  }
  