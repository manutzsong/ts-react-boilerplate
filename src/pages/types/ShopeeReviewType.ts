export interface ShopeeReviewType {
    code: number
    data: Data
    message: string
    user_message: string
  }
  
  export interface Data {
    page_info: PageInfo
    list: List[]
    rating_star_count: number[]
  }
  
  export interface PageInfo {
    total: number
    page_number: number
    page_size: number
  }
  
  export interface List {
    comment_id: number
    is_hidden: boolean
    rating_star: number
    comment: string
    images: string[]
    ctime: number
    user_id: number
    user_name: string
    user_portrait: string
    order_id: number
    order_sn: string
    product_id: number
    model_id: number
    product_cover: string
    product_name: string
    model_name: string
  }
  