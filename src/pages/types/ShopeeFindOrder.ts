export interface ShopeeFindOrder {
    code: number
    data: Data
    message: string
    user_message: string
  }
  
  export interface Data {
    product_name_result: ProductNameResult
    item_sku_result: ItemSkuResult
    model_sku_result: ModelSkuResult
    order_sn_result: OrderSnResult
    buyer_user_name_result: BuyerUserNameResult
    shipping_trace_numbers_result: ShippingTraceNumbersResult
  }
  
  export interface ProductNameResult {
    total: number
    list: any
  }
  
  export interface ItemSkuResult {
    total: number
    list: any
  }
  
  export interface ModelSkuResult {
    total: number
    list: any
  }
  
  export interface OrderSnResult {
    total: number
    list: List[]
  }
  
  export interface List {
    order_id: number
    order_sn: string
    buyer_image: string
    buyer_name: string
    model_image: string
  }
  
  export interface BuyerUserNameResult {
    total: number
    list: any
  }
  
  export interface ShippingTraceNumbersResult {
    total: number
    list: any
  }
  