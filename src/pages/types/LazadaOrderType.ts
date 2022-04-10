export interface LazadaOrder {
    api: string
    data: Data
    ret: string[]
    v: string
  }
  
  export interface Data {
    data: Daum[]
  }
  
  export interface Daum {
    name: string
    orderDate: string
    orderNumber: string
    customName: string
    customerId: string
    finishOrderCount: number
    isNewBuyer: boolean
    successfulDeliveryRate: string
    tags: any[]
    detailAddress: string
    isWork: boolean
    locationTree: string
    receiver: string
    dataSource: LazadaOrderItem[]
    isVat: boolean
    total: string
  }
  
  export interface LazadaOrderItem {
    allowReturn: boolean
    deliveryOption: string
    itemId: string
    itemImgUrl: string
    itemName: string
    orderDetailItemDetailVOS: any[]
    orderLineId: string
    otherFees: string
    promotions: string
    sellerSku: string
    shippingFee: string
    shippingFeePromo: string
    skuId: string
    skuInfo: string
    status: string
    totalAmount: string
    warehouseType: string
    isVat: boolean
    name: string
    total: string
    children: Children[]
    quantity?: number
    sum?:number
  }

  
  
  export interface Children {
    isVat: boolean
    name: string
    total: string
  }
  