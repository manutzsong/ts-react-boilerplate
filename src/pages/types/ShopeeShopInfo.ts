export interface ShopeeShopInfo {
    message: string
    code: number
    data: Data
    user_message: string
  }
  
  export interface Data {
    rating_normal: number
    auto_reply_msg: string
    enable_product_dimension: boolean
    cb_return_address_id: number
    able_to_disable_channel: boolean
    rating_bad: number
    shop_id: number
    enable_mass_update: boolean
    average_shipping_time: number
    display_response_rate: number
    jko_payment_status: number
    admin_info: AdminInfo
    enable_my_voucher: boolean
    pickup_address_id: number
    item_count: number
    sync_stock_from_wms: boolean
    stock_alert_on: boolean
    enable_preferred_logistics: boolean
    follower_count: number
    cb_option: number
    shopee_verified_flag: number
    enable_display_unitno: boolean
    installment_smid: InstallmentSmid
    description: string
    rating_good: number
    enable_self_discount: boolean
    installment_status: number
    return_address_id: number
    enable_credit_card_payment: number
    fulfillment_rate: number
    is_sip_primary: boolean
    is_taxable_shop: boolean
    response_time: number
    shop_region: string
    auto_reply_on: boolean
    disable_make_offer: number
    name: string
    have_payment_password: boolean
    rating_star: number
    installment_tenures: any[]
    cover: string
    enable_shop_migration: boolean
    weight_unit: string
    chat_disabled: boolean
    banners: string[]
    new_banners: NewBanner[]
    non_fulfillment_rate: number
  }
  
  export interface AdminInfo {
    has_whs: boolean
    official_shop: boolean
  }
  
  export interface InstallmentSmid {
    banks: Bank[]
    is_under_resubmission: boolean
  }
  
  export interface Bank {
    status: number
    bank_id: string
  }
  
  export interface NewBanner {
    image_url: string
    type: number
    video_url: string
  }
  