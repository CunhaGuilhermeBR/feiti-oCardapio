export interface OrderFeed {
    eventId: string;
    handle: string;
    domain: string;
    state: string;
    lastState: any;
    orderId: string;
    lastChange: string;
    currentChange: string;
    availableDate: string;
}

export interface Order {
    orderId: string;
    sequence: string;
    marketplaceOrderId: string;
    marketplaceServicesEndpoint: string;
    sellerOrderId: any;
    origin: string;
    affiliateId: string;
    salesChannel: string;
    merchantName: any;
    status: string;
    workflowIsInError: boolean;
    statusDescription: string;
    value: number;
    creationDate: string;
    lastChange: string;
    orderGroup: any;
    totals: Total[];
    items: Item[];
    marketplaceItems: any[];
    clientProfileData: ClientProfileData;
    giftRegistryData: any;
    marketingData: any;
    ratesAndBenefitsData: RatesAndBenefitsData;
    shippingData: ShippingData;
    paymentData: PaymentData;
    packageAttachment: PackageAttachment;
    sellers: Seller[];
    callCenterOperatorData: any;
    followUpEmail: string;
    lastMessage: any;
    hostname: string;
    invoiceData: InvoiceData;
    changesAttachment: any;
    openTextField: any;
    roundingError: number;
    orderFormId: any;
    commercialConditionData: any;
    isCompleted: boolean;
    customData: any;
    storePreferencesData: StorePreferencesData;
    allowCancellation: boolean;
    allowEdition: boolean;
    isCheckedIn: boolean;
    marketplace: Marketplace;
    authorizedDate: string;
    invoicedDate: any;
    cancelReason: any;
    itemMetadata: ItemMetadata;
    subscriptionData: any;
    taxData: any;
    checkedInPickupPointId: any;
    cancellationData: any;
    cancellationRequests: any;
    clientPreferencesData: any;
}

export interface Total {
    id: string;
    name: string;
    value: number;
}

export interface Item {
    uniqueId: string;
    id: string;
    productId: string;
    ean: any;
    lockId: string;
    itemAttachment: ItemAttachment;
    attachments: any[];
    quantity: number;
    seller: string;
    name: string;
    refId: string;
    price: number;
    listPrice: number;
    manualPrice: any;
    priceTags: PriceTag[];
    imageUrl: string;
    detailUrl: any;
    components: any[];
    bundleItems: any[];
    params: any[];
    offerings: any[];
    attachmentOfferings: any[];
    sellerSku: string;
    priceValidUntil: any;
    commission: number;
    tax: number;
    preSaleDate: any;
    additionalInfo: AdditionalInfo;
    measurementUnit: string;
    unitMultiplier: number;
    sellingPrice: number;
    isGift: boolean;
    shippingPrice: any;
    rewardValue: number;
    freightCommission: number;
    priceDefinition: PriceDefinition;
    taxCode: any;
    parentItemIndex: any;
    parentAssemblyBinding: any;
    callCenterOperator: any;
    serialNumbers: any;
    assemblies: any[];
    costPrice: number;
}

export interface ItemAttachment {
    content: Content;
    name: any;
}

export interface Content { }

export interface PriceTag {
    name: string;
    value: number;
    isPercentual: boolean;
    identifier: any;
    rawValue: number;
    rate: any;
    jurisCode: any;
    jurisType: any;
    jurisName: any;
}

export interface AdditionalInfo {
    brandName: string;
    brandId: string;
    categoriesIds: string;
    categories: Category[];
    productClusterId: any;
    commercialConditionId: string;
    dimension: Dimension;
    offeringInfo: any;
    offeringType: any;
    offeringTypeId: any;
}

export interface Category {
    id: number;
    name: string;
}

export interface Dimension {
    cubicweight: number;
    height: number;
    length: number;
    weight: number;
    width: number;
}

export interface PriceDefinition {
    sellingPrices: SellingPrice[];
    calculatedSellingPrice: number;
    total: number;
    reason: any;
}

export interface SellingPrice {
    value: number;
    quantity: number;
}

export interface ClientProfileData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    documentType: string;
    document: string;
    phone: string;
    corporateName: any;
    tradeName: any;
    corporateDocument: any;
    stateInscription: any;
    corporatePhone: any;
    isCorporate: boolean;
    userProfileId: any;
    userProfileVersion: any;
    customerClass: any;
}

export interface RatesAndBenefitsData {
    id: string;
    rateAndBenefitsIdentifiers: any[];
}

export interface ShippingData {
    id: string;
    address: Address;
    logisticsInfo: LogisticsInfo[];
    trackingHints: any[];
    selectedAddresses: SelectedAddress[];
}

export interface Address {
    addressType: string;
    receiverName: string;
    addressId: string;
    versionId: any;
    entityId: any;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    street: string;
    number: string;
    neighborhood: string;
    complement: string;
    reference: any;
    geoCoordinates: number[];
}

export interface LogisticsInfo {
    itemIndex: number;
    selectedSla: string;
    lockTTL: string;
    price: number;
    listPrice: number;
    sellingPrice: number;
    deliveryWindow: any;
    deliveryCompany: string;
    shippingEstimate: string;
    shippingEstimateDate: string;
    slas: any;
    shipsTo: any;
    deliveryIds: DeliveryId[];
    deliveryChannels: any;
    deliveryChannel: string;
    pickupStoreInfo: PickupStoreInfo;
    addressId: string;
    versionId: any;
    entityId: any;
    polygonName: string;
    pickupPointId: any;
    transitTime: string;
}

export interface DeliveryId {
    courierId: string;
    courierName: string;
    dockId: string;
    quantity: number;
    warehouseId: string;
    accountCarrierName: string;
    kitItemDetails: any[];
}

export interface PickupStoreInfo {
    additionalInfo: any;
    address: any;
    dockId: any;
    friendlyName: any;
    isPickupStore: boolean;
}

export interface SelectedAddress {
    addressId: string;
    versionId: any;
    entityId: any;
    addressType: string;
    receiverName: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    reference: any;
    geoCoordinates: number[];
}

export interface PaymentData {
    giftCards: any[];
    transactions: Transaction[];
}

export interface Transaction {
    isActive: boolean;
    transactionId: any;
    merchantName: any;
    payments: Payment[];
}

export interface Payment {
    id: any;
    paymentSystem: string;
    paymentSystemName: string;
    value: number;
    installments: number;
    referenceValue: number;
    cardHolder: any;
    cardNumber: any;
    firstDigits: any;
    lastDigits: any;
    cvv2: any;
    expireMonth: any;
    expireYear: any;
    url: any;
    giftCardId: any;
    giftCardName: any;
    giftCardCaption: any;
    redemptionCode: any;
    group: any;
    tid: any;
    dueDate: any;
    connectorResponses: ConnectorResponses;
    giftCardProvider: any;
    giftCardAsDiscount: any;
    koinUrl: any;
    accountId: any;
    parentAccountId: any;
    bankIssuedInvoiceIdentificationNumber: any;
    bankIssuedInvoiceIdentificationNumberFormatted: any;
    bankIssuedInvoiceBarCodeNumber: any;
    bankIssuedInvoiceBarCodeType: any;
    billingAddress: any;
    paymentOrigin: any;
}

export interface ConnectorResponses { }

export interface PackageAttachment {
    packages: any[];
}

export interface Seller {
    id: string;
    name: string;
    logo: any;
    fulfillmentEndpoint: any;
}

export interface InvoiceData {
    address: any;
    userPaymentInfo: UserPaymentInfo;
}

export interface UserPaymentInfo {
    paymentMethods: string[];
}

export interface StorePreferencesData {
    countryCode: string;
    currencyCode: string;
    currencyFormatInfo: CurrencyFormatInfo;
    currencyLocale: number;
    currencySymbol: string;
    timeZone: string;
}

export interface CurrencyFormatInfo {
    CurrencyDecimalDigits: number;
    CurrencyDecimalSeparator: string;
    CurrencyGroupSeparator: string;
    CurrencyGroupSize: number;
    StartsWithCurrencySymbol: boolean;
}

export interface Marketplace {
    baseURL: string;
    isCertified: boolean;
    name: string;
}

export interface ItemMetadata {
    Items: Item2[];
}

export interface Item2 {
    Id: string;
    Seller: string;
    Name: string;
    SkuName: string;
    ProductId: string;
    RefId: string;
    Ean: any;
    ImageUrl: string;
    DetailUrl: string;
    AssemblyOptions: any[];
}