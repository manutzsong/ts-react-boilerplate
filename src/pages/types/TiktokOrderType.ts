/* eslint-disable @typescript-eslint/no-empty-interface */
export interface TiktokOrderType {
    code: number
    message: string
    data: Data
  }
  
  export interface Data {
    main_order: MainOrder
  }
  
  export interface MainOrder {
    main_order_id: string
    combo_id: string
    main_order_create_time: number
    main_order_update_time: number
    main_order_type: number
    delivery_option: number
    payment_type: number
    quantity: number
    main_order_status: number
    price_detail: PriceDetail
    region: string
    available_actions: number[]
    order_lines: OrderLine[]
    buyer_info: BuyerInfo
    pending_start_time: number
    ship_on_time_sla: number
    delivery_update_time: number
    buyer_note: string
    trans_histories: TransHistory[]
    payment_info: PaymentInfo
    multi_status: number
    contact_buyer_link: string
    tracking_logistic: string
    skus: Sku[]
    logistic_info: LogisticInfo
    main_order_display_status: number
    main_order_display_sub_status: number
    fulfillment_status: number
    pay_method: string
    reverse_progress: number
    rc_processing: boolean
    provider: Provider2
    delivery_option_desc: string
    latest_rts_timestamp: number
    latest_tts_timestamp: number
    main_order_stocking_timestamp: number
    close_order_sla_timestamp: number
    fulfillment_type: number
    warehouse_name: string
    warehouse_id: string
    split_combined_tag: number
    fulfill_unit_ids: string[]
    product_type: number
    top_up_no: string
    phone_number: string
  }
  
  export interface PriceDetail {
    format_price: string
    currency: string
  }
  
  export interface OrderLine {
    order_line_id: string
    main_order_id: string
    sku_id: string
    sku_name: string
    order_line_status: number
    order_line_fulfillment_status: number
    order_line_payment_status: number
    price_detail: PriceDetail2
    product_name: string
    product_image: ProductImage
    order_line_print: number
    available_actions: number[]
    reverse_status: number
  }
  
  export interface PriceDetail2 {
    format_price: string
    currency: string
  }
  
  export interface ProductImage {
    height: number
    width: number
    thumb_uri: string
    thumb_url_list: string[]
    uri: string
    url_list: string[]
  }
  
  export interface BuyerInfo {
    shipping_address: ShippingAddress
    buyer_nickname: string
    delivery_options: number
    delivery_option_desc: string
    avatar: Avatar
  }
  
  export interface ShippingAddress {
    items: Item[]
    region: Region
    districts: District[]
  }
  
  export interface Item {
    key: string
    value: string
  }
  
  export interface Region {
    name: string
    geoname_id: string
  }
  
  export interface District {
    name: string
    geoname_id: string
  }
  
  export interface Avatar {
    height: number
    width: number
    thumb_uri: string
    thumb_url_list: string[]
    uri: string
    url_list: string[]
  }
  
  export interface TransHistory {
    description: string
    detail: string
    trans_time: number
  }
  
  export interface PaymentInfo {
    subtotal: Subtotal
    taxes: Taxes
    shipping_fee: ShippingFee
    platform_discount_total: PlatformDiscountTotal
    seller_discount_total: SellerDiscountTotal
    grand_total: GrandTotal
    main_order_origin_sale_price: MainOrderOriginSalePrice
    shipping_origin_fee: ShippingOriginFee
    shipping_fee_discount_seller: ShippingFeeDiscountSeller
    shipping_fee_discount_platform: ShippingFeeDiscountPlatform
    promotion_infos: PromotionInfo[]
  }
  
  export interface Subtotal {
    format_price: string
    currency: string
  }
  
  export interface Taxes {
    format_price: string
    currency: string
  }
  
  export interface ShippingFee {
    format_price: string
    currency: string
  }
  
  export interface PlatformDiscountTotal {
    format_price: string
    currency: string
  }
  
  export interface SellerDiscountTotal {
    format_price: string
    currency: string
  }
  
  export interface GrandTotal {
    format_price: string
    currency: string
  }
  
  export interface MainOrderOriginSalePrice {
    format_price: string
    currency: string
  }
  
  export interface ShippingOriginFee {
    format_price: string
    currency: string
  }
  
  export interface ShippingFeeDiscountSeller {
    format_price: string
    currency: string
  }
  
  export interface ShippingFeeDiscountPlatform {
    format_price: string
    currency: string
  }
  
  export interface PromotionInfo {
    promotion_name: string
    promotion_cost: PromotionCost
    promotion_type: number
  }
  
  export interface PromotionCost {
    format_price: string
    currency: string
  }
  
  export interface Sku {
    product_name: string
    sku_name: string
    quantity: number
    product_image: ProductImage2
    unit_price: UnitPrice
    total_price: TotalPrice
    sku_reverse_status: number
    sku_fulfillment_failed_status: number
    sku_id: string
    seller_sku_name: string
    presale: boolean
    sla: Sla
    order_line_ids: string[]
    sku_display_status: number
    fulfill_unit_id: string
    package_pickup_detail: PackagePickupDetail
    package_delivery_option: PackageDeliveryOption
    provider_info: ProviderInfo
    sku_status_description: string
    product_type: number
    sku_update_time: number
  }
  
  export interface ProductImage2 {
    height: number
    width: number
    thumb_uri: string
    thumb_url_list: string[]
    uri: string
    url_list: string[]
  }
  
  export interface UnitPrice {
    format_price: string
    currency: string
  }
  
  export interface TotalPrice {
    format_price: string
    currency: string
  }
  
  export interface Sla {
    latest_rts_timestamp: number
    latest_tts_timestamp: number
    close_order_sla_timestamp: number
  }
  
  export interface PackagePickupDetail {}
  
  export interface PackageDeliveryOption {
    delivery_option: number
    delivery_option_desc: string
  }
  
  export interface ProviderInfo {
    provider: Provider
  }
  
  export interface Provider {
    name: string
  }
  
  export interface LogisticInfo {
    time: number
    title: string
    description: string
  }
  
  export interface Provider2 {
    id: string
    name: string
    icon_url: string
  }
  