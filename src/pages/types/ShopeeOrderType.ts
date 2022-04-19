export interface ShopeeOrderType {
  message: string;
  code: number;
  data: Data;
  user_message: string;
}

export interface Data {
  comm_fee: string;
  shipping_method: number;
  fulfill_by_shopee: boolean;
  payment_method: number;
  wallet_discount: string;
  shop_id: number;
  add_on_deal_id: number;
  buyer_address_name: string;
  complete_time: number;
  fulfillment_shipping_method: number;
  actual_shipping_fee: string;
  ship_by_date: number;
  cancel_time: number;
  buyer_cpf_id: string;
  return_id: number;
  checkout_id: number;
  voucher_code: string;
  total_price: string;
  tax_amount: string;
  first_item_is_wholesale: boolean;
  is_buyercancel_toship: boolean;
  list_type: number;
  first_item_count: number;
  shipping_confirm_time: number;
  payby_date: number;
  seller_service_fee: string;
  status_ext: number;
  pay_by_credit_card: boolean;
  first_item_return: boolean;
  logistics_status: number;
  create_time: number;
  auto_cancel_3pl_ack_date: number;
  price_before_discount: string;
  seller_due_date: number;
  coins_cash_by_voucher: string;
  channel_hotline: string;
  item_count: number;
  shipment_config: boolean;
  logistics_channel: number;
  coin_used: string;
  origin_shipping_fee: string;
  actual_price: string;
  order_id: number;
  pickup_time: number;
  auto_cancel_arrange_ship_date: number;
  is_affiliated_shop_order: boolean;
  voucher_price: string;
  trans_detail_shipping_fee: string;
  buyer_is_rated: number;
  express_channel: number;
  logistics_extra_data: string;
  dropshipping_info: DropshippingInfo;
  remark: string;
  buyer_txn_fee: string;
  checkout_carrier_name: string;
  checkout_shipping_method: number;
  cancel_reason_ext: number;
  coin_offset: string;
  shipping_proof_status: number;
  buyer_address_phone: string;
  fulfillment_carrier_name: string;
  masking_carrier_name: string;
  forder_id: string;
  buyer_paid_amount: string;
  ratecancel_by_date: number;
  first_item_model: string;
  buyer_user: BuyerUser;
  instant_buyercancel_toship: boolean;
  parcel_no: number;
  is_request_cancellation: boolean;
  order_sn: string;
  cancel_by: string;
  preferred_delivery_timeslot: any;
  note_mtime: number;
  delivery_time: number;
  pickup_attempts: number;
  logistics_flag: number;
  voucher_absorbed_by_seller: boolean;
  shipping_address: string;
  shipping_fee: string;
  shipping_traceno: string;
  pickup_cutoff_time: number;
  fulfillment_channel_id: number;
  buyer_last_change_address_time: number;
  currency: string;
  escrow_release_time: number;
  shipping_proof: string;
  logid: number;
  checkout_channel_id: number;
  order_type: number;
  paid_amount: string;
  credit_card_promotion_discount: string;
  carrier_shipping_fee: number;
  rate_by_date: number;
  order_ratable: boolean;
  note: string;
  shipping_fee_discount: number;
  card_txn_fee_info: CardTxnFeeInfo;
  status: number;
  first_item_name: string;
  buyer_cancel_reason: number;
  cancellation_end_date: any;
  order_item_price_infos: any;
  order_items: OrderItem[];
  actual_carrier: string;
  used_voucher: number;
  seller_address_id: number;
  masking_channel_id: number;
  cancel_userid: number;
  user_id: number;
  seller_address: SellerAddress;
  coins_by_voucher: number;
  arrange_pickup_by_date: number;
}

export interface DropshippingInfo {
  phone_number: string;
  enabled: number;
  name: string;
}

export interface BuyerUser {
  phone_public: boolean;
  buyer_rating: number;
  user_id: number;
  language: string;
  hide_likes: number;
  cb_option: number;
  followed: boolean;
  ext_info: ExtInfo;
  rating_star: number;
  rating_count: any[];
  delivery_order_count: number;
  shop_id: number;
  portrait: string;
  delivery_succ_count: number;
  user_name: string;
}

export interface ExtInfo {
  disable_new_device_login_otp: boolean;
  delivery_address_id: number;
  address_info: AddressInfo;
  holiday_mode_on: boolean;
  smid_status: number;
  gender: number;
  tos_accepted_time: number;
  feed_private: boolean;
  access: Access;
  birth_timestamp: number;
  ba_check_status: number;
}

export interface AddressInfo {
  in_white_list: boolean;
  mcount: number;
  mcount_create_time: number;
}

export interface Access {
  wallet_setting: number;
  seller_coin_setting: number;
  seller_ads_setting: number;
  seller_wholesale_setting: number;
  hide_likes: number;
}

export interface CardTxnFeeInfo {
  card_txn_fee: string;
  rule_id: number;
}

export interface OrderItem {
  is_add_on_sub_item: boolean;
  is_virtual_sku: boolean;
  item_price: string;
  bundle_deal_product: BundleDealProduct[];
  comm_fee_rate: number;
  shop_id: number;
  snapshot_id: number;
  add_on_deal_id: number;
  model_id: number;
  item_list: ItemList[];
  is_wholesale: boolean;
  item_model: ItemModel;
  status: number;
  bundle_deal_id: number;
  product: Product;
  item_id: number;
  sub_type: number;
  bundle_deal_model: BundleDealModel[];
  order_item_id: number;
  price_before_bundle: string;
  bundle_deal?: BundleDeal;
  amount: number;
  order_price: string;
  group_id: string;
}

export interface BundleDealProduct {
  cmt_count: number;
  cat_id: number;
  currency: string;
  shop_id: number;
  snapshot_id: number;
  images: string[];
  price_before_discount: string;
  estimated_days: number;
  sku: string;
  liked_count: number;
  branch: string;
  price: string;
  stock: number;
  status: number;
  model_id: number;
  description: string;
  brand: string;
  sold: number;
  item_id: number;
  condition: number;
  ctime: number;
  name: string;
  is_pre_order: boolean;
}

export interface ItemList {
  model_id: number;
  is_virtual_sku: boolean;
  item_price: string;
  comm_fee_rate: number;
  amount: number;
  snapshot_id: number;
  item_id: number;
}

export interface ItemModel {
  status: number;
  model_id: number;
  name: string;
  price: string;
  ctime: number;
  currency: string;
  sku: string;
  mtime: number;
  item_id: number;
  promotion_id: number;
  price_before_discount: string;
  rebate_price: string;
  sold: number;
  stock: number;
}

export interface Product {
  cmt_count: number;
  cat_id: number;
  currency: string;
  shop_id: number;
  snapshot_id: number;
  images: string[];
  price_before_discount: string;
  estimated_days: number;
  sku: string;
  liked_count: number;
  branch: string;
  price: string;
  stock: number;
  status: number;
  model_id: number;
  description: string;
  brand: string;
  sold: number;
  item_id: number;
  condition: number;
  ctime: number;
  name: string;
  is_pre_order: boolean;
}

export interface BundleDealModel {
  status: number;
  model_id: number;
  name: string;
  price: string;
  ctime: number;
  currency: string;
  sku: string;
  mtime: number;
  item_id: number;
  promotion_id: number;
  price_before_discount: string;
  rebate_price: string;
  sold: number;
  stock: number;
}

export interface BundleDeal {
  status: number;
  bundle_deal_id: number;
  usage_limit: number;
  ctime: any;
  comm_fee: any;
  country: string;
  start_time: number;
  labels: Label[];
  shopid: number;
  rebate_amount: number;
  flag: number;
  end_time: number;
  mtime: any;
  bundle_deal_rule: BundleDealRule;
}

export interface Label {
  value: string;
  language: string;
}

export interface BundleDealRule {
  rule_type: number;
  discount_value: string;
  fix_price: string;
  min_amount: number;
  discount_percentage: string;
}

export interface SellerAddress {
  status: number;
  city: string;
  address_id: number;
  user_id: number;
  name: string;
  district: string;
  country: string;
  town: string;
  mtime: number;
  logistics_status: number;
  full_address: string;
  ext_info: ExtInfo2;
  phone: string;
  state: string;
  def_time: number;
  address: string;
  icno: string;
  zip_code: string;
  ctime: number;
}

export interface ExtInfo2 {
  geo_info: string;
}
