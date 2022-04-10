export interface LazadaTransactions {
    api: string
    data: Data
    ret: string[]
    v: string
  }
  
  export interface Data {
    data: Data2
    succeeded: boolean
  }
  
  export interface Data2 {
    dataSource: DataSourceTransactions[]
    pageInfo: PageInfo
  }
  
  export interface DataSourceTransactions {
    action: Action
    amountType: AmountType[]
    billCycle: number
    billCycleDisplay: string
    closingBalance: string
    closingBalanceCurrency: string
    endDate: number
    linkUrl: string
    openingBalance: string
    openingBalanceCurrency: string
    payoutStatus: string
    payoutStatusCode: string
    startDate: number
    statementNumber: string
    statementPeriod: string
    totalPayout: string
    totalPayoutCurrency: string
  }
  
  export interface Action {
    exportOptions: ExportOption[]
    label: string
    options: Option[]
  }
  
  export interface ExportOption {
    bizParam?: BizParam
    businessAction?: string
    businessCode?: string
    fileName: string
    fileType?: string
    label: string
    taskType?: string
  }
  
  export interface BizParam {
    endDate: number
    channel: string
    startDate: number
  }
  
  export interface Option {
    exportApi?: string
    exportHisApi?: string
    exportKey?: string
    exportName?: string
    extraParams?: ExtraParams
    label: string
    linkUrl: string
    transactionDateRange?: string
  }
  
  export interface ExtraParams {
    transactionDataRange: string
    channel: string
    version: string
    fileType: string
  }
  
  export interface AmountType {
    amount: string
    amountDecimal: number
    childrenFeeItemList: ChildrenFeeItemList[]
    currency: string
    description: string
    feeType: number
    itemRelationLevel: number
    name: string
  }
  
  export interface ChildrenFeeItemList {
    amount: string
    amountDecimal: number
    currency: string
    description: string
    feeType: number
    itemRelationLevel: number
    name: string
  }
  
  export interface PageInfo {
    current: number
    pageSize: number
    total: number
  }
  