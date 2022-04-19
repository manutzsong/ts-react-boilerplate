
export interface ShopeeShopAddress {
    code: number
    data: Data
    message: string
    user_message: string
  }
  
  export interface Data {
    list: List[]
  }
  
  export interface List {
    address_id: number
    user_id: number
    name: string
    phone: string
    country: string
    state: string
    city: string
    address: string
    status: number
    zip_code: string
    full_address: string
    district: string
    town: string
    geo_info: string
  }
  