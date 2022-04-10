export interface LazadaOrderFind {
    api: string
    data: Data
    ret: string[]
    v: string
  }
  
  export interface Data {
    data: Data2
  }
  
  export interface Data2 {
    pageInfo: PageInfo
    dataSource: DataSource[]
  }
  
  export interface PageInfo {
    total: number
    pageSize: number
    page: number
  }
  
  export interface DataSource {
    buyerId: number
    buyerName: string
    cashOnDelivery: boolean
    createDate: string
    createTime: string
    creationTime: number
    enableSFPGraySeller: boolean
    enableSotBreached: boolean
    enableSotWhiteList: boolean
    expectDeliveryMaxTime: string
    expectDeliveryMinTime: string
    express: boolean
    gc: boolean
    guarantee: boolean
    hasPackage: boolean
    hasSLAExtensionPrivilege: boolean
    imChatLink: string
    inStoreO2O: boolean
    includeAutoCancelWhiteTag: boolean
    includeDigital: boolean
    instant: boolean
    maxSLAExtensionDays: number
    needReprint: boolean
    orderNumber: string
    orderType: string
    paymentMethod: string
    preOrder: boolean
    printedAwb: boolean
    printedCheckList: boolean
    printedInvoice: boolean
    shippingFee: string
    shopPromotion: boolean
    skus: Sku[]
    slaColorInfo: string
    slaCountDownInfo: string
    slaRuleInfo: string
    tabStatus: string
    totalQuantity: number
    totalRetailPrice: string
    totalUnitPrice: string
    warehouseName: string
  }
  
  export interface Sku {
    allowReturn: boolean
    autoCancelWhiteTag: boolean
    buyerName: string
    createDate: string
    createTime: string
    creationTime: number
    deliveryType: string
    digital: boolean
    enableABCWhiteList: boolean
    enableSFPGraySeller: boolean
    enableSotBreached: boolean
    enableSotWhiteList: boolean
    expectDeliveryMaxTime: string
    expectDeliveryMinTime: string
    express: boolean
    freeGift: boolean
    freeSample: boolean
    fulfillmentOrderId: string
    gc: boolean
    guarantee: boolean
    image: string
    inStoreO2O: boolean
    instant: boolean
    invoiceName: string
    itemStatus: string
    itemUrl: string
    needReprint: boolean
    o2o: boolean
    orderItemId: string
    orderNumber: string
    orderType: number
    packageStatusName: string
    packed: boolean
    paymentMethod: string
    preOrder: boolean
    printedAwb: boolean
    printedCheckList: boolean
    printedInvoice: boolean
    productName: string
    productTitle: string
    quantity: number
    retailPrice: string
    sellerSku: string
    shopPromotion: boolean
    skuInfo: string
    slaBreached: boolean
    slaColorInfo: string
    slaCountDownInfo: string
    slaOptions: SlaOption[]
    slaRuleInfo: string
    sof: boolean
    sotSla: string
    totalQuantity: number
    totalRetailPrice: string
    totalUnitPrice: string
    unitPrice: string
    warehouseCode: string
    warehouseType: string
  }
  
  export interface SlaOption {
    label: string
  }
  