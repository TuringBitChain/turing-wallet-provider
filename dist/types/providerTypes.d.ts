export type PubKey = {
    tbcPubKey: string;
    // ordPubKey: string;
    // identityPubKey: string;
};
export type Address = {
    tbcAddress: string;
    // ordAddress: string;
    // identityAddress: string;
};
export type Balance = {
    tbc: number;
    // satoshis: number;
    // usdInCents: number;
};
export type SocialProfile = {
    displayName: string;
    avatar: string;
};
export type OrdinalData = {
    types?: string[];
    insc?: Inscription;
    map?: {
        [key: string]: any;
    };
    b?: File;
    sigma?: Sigma[];
    list?: Listing;
    tbc20?: Tbc20;
    lock?: Lock;
};
export type Lock = {
    address: string;
    until: number;
};
export type Sigma = {
    algorithm: string;
    address: string;
    signature: string;
    vin: number;
};
export type Listing = {
    price: number;
    payout: string;
};
export type Tbc20 = {
    id?: string;
    p: string;
    op: string;
    tick?: string;
    amt: string;
    status?: Tbc20Status;
};
export type Origin = {
    outpoint: string;
    data?: OrdinalData;
    num?: number;
};
export declare enum Tbc20Status {
    Invalid = -1,
    Pending = 0,
    Valid = 1
}
export type File = {
    type: string;
    size: number;
    hash: string;
};
export type Inscription = {
    json?: any;
    text?: string;
    words?: string[];
    file: File;
};
export type Ordinal = {
    txid: string;
    vout: number;
    outpoint: string;
    satoshis: number;
    owner: string;
    script: string;
    spend: string;
    origin: Origin;
    height: number;
    idx: number;
    data: OrdinalData;
};
export type SignedMessage = {
    address: string;
    pubKey: string;
    sig: string;
    message: string;
    derivationTag: DerivationTag;
};
export type TransactionFlag = "P2PKH" | "COLLECTION_CREATE" | "NFT_CREATE" | "NFT_TRANSFER" | "FT_MINT" | "FT_TRANSFER" | "POOLNFT_MINT" | "POOLNFT_INIT" | "POOLNFT_LP_INCREASE" | "POOLNFT_LP_CONSUME" | "POOLNFT_SWAP_TO_TOKEN" | "POOLNFT_SWAP_TO_TBC" | "POOLNFT_MERGE" | "FTLP_MERGE";
export type SendTransaction = {
    flag: TransactionFlag;
    satoshis?: number;
    address?: string;
    collection_data?: string;
    ft_data?: string;
    nft_data?: string;
    collection_id?: string;
    nft_contract_address?: string;
    ft_contract_address?: string;
    tbc_amount?: number;
    ft_amount?: number;
    merge_times?: number;
};
export type TransferOrdinal = {
    address: string;
    origin: string;
    outpoint: string;
};
export type InternalTuringTags = {
    label: "Turing";
    id: "tbc";
    domain: "";
    meta: {};
} | {
    label: "Turing";
    id: "ord";
    domain: "";
    meta: {};
} | {
    label: "Turing";
    id: "identity";
    domain: "";
    meta: {};
};
export type DerivationTag = InternalTuringTags | {
    label: string;
    id: string;
    domain: string;
    meta?: Record<string, any>;
};
export type SignMessage = {
    message: string;
    encoding?: "utf8" | "hex" | "base64";
};
export type KeyTypes = "tbc" | "ord";
export type Broadcast = {
    rawtx: string;
    fund?: boolean;
};
export type PurchaseOrdinal = {
    outpoint: string;
    marketplaceRate?: number;
    marketplaceAddress?: string;
};
export type Utxos = {
    satoshis: number;
    script: string;
    txid: string;
    vout: number;
};
/**
 * `SignatureRequest` contains required informations for a signer to sign a certain input of a transaction.
 */
export type SignatureRequest = {
    prevTxid: string;
    outputIndex: number;
    /** The index of input to sign. */
    inputIndex: number;
    /** The previous output satoshis value of the input to spend. */
    satoshis: number;
    /** The address(es) of corresponding private key(s) required to sign the input. */
    address: string | string[];
    /** The previous output script of input, default value is a P2PKH locking script for the `address` if omitted. */
    script?: string;
    /** The sighash type, default value is `SIGHASH_ALL | SIGHASH_FORKID` if omitted. */
    sigHashType?: number;
    /**
     * Index of the OP_CODESEPARATOR to split the previous output script at during verification.
     * If undefined, the whole script is used.
     * */
    csIdx?: number;
    /** The flag to distinguish the transaction.*/
    flag: TransactionFlag;
};
/**
 * `SignatureResponse` contains the signing result corresponding to a `SignatureRequest`.
 */
export type SignatureResponse = {
    /** The index of input. */
    inputIndex: number;
    /** The signature.*/
    sig: string;
    /** The public key bound with the `sig`. */
    pubKey: string;
    /** The sighash type, default value is `SIGHASH_ALL | SIGHASH_FORKID` if omitted. */
    sigHashType: number;
    /** The index of the OP_CODESEPARATOR to split the previous output script at.*/
    csIdx?: number;
};
/**
 * `SendTbcResponse` contains the result of sendTbc.
 */
export type SendTransactionResponse = {
    txid: string;
    rawtx: string;
};
export type GetSignatures = {
    rawtx: string;
    sigRequests: SignatureRequest[];
};
export type TaggedDerivationRequest = {
    label: string;
    id: string;
    meta?: Record<string, any>;
};
export type TaggedDerivationResponse = {
    address: string;
    pubKey: string;
    tag: DerivationTag;
};
export type MimeTypes = "text/plain" | "text/html" | "text/css" | "application/javascript" | "application/json" | "application/xml" | "image/jpeg" | "image/png" | "image/gif" | "image/svg+xml" | "audio/mpeg" | "audio/wav" | "audio/wave" | "video/mp4" | "application/pdf" | "application/msword" | "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "application/zip" | "application/x-7z-compressed" | "application/x-gzip" | "application/x-tar" | "application/x-bzip2";
export type MAP = {
    app: string;
    type: string;
    [prop: string]: string;
};
export type RawInscription = {
    base64Data: string;
    mimeType: MimeTypes;
    map?: MAP;
};
export type InscribeRequest = {
    address: string;
    base64Data: string;
    mimeType: MimeTypes;
    map?: MAP;
    satoshis?: number;
};
export type GetTaggedKeysRequest = {
    label: string;
    ids?: string[];
};
export type TuringProviderType = {
    isReady: boolean;
    connect: () => Promise<string | undefined>;
    disconnect: () => Promise<boolean>;
    isConnected: () => Promise<boolean>;
    getPubKey: () => Promise<PubKey | undefined>;
    getAddress: () => Promise<Address | undefined>;
    // getSocialProfile: () => Promise<SocialProfile | undefined>;
    getBalance: () => Promise<Balance | undefined>;
    // getOrdinals: () => Promise<Ordinal[] | undefined>;
    sendTransaction: (params: SendTransaction[]) => Promise<SendTransactionResponse | undefined>;
    // transferOrdinal: (params: TransferOrdinal) => Promise<string | undefined>;
    // purchaseOrdinal: (params: PurchaseOrdinal) => Promise<string | undefined>;
    signMessage: (params: SignMessage) => Promise<SignedMessage | undefined>;
    // getSignatures: (params: GetSignatures) => Promise<SignatureResponse[] | undefined>;
    broadcast: (params: Broadcast) => Promise<string | undefined>;
    // getExchangeRate: () => Promise<number | undefined>;
    getPaymentUtxos: () => Promise<Utxos[] | undefined>;
    // generateTaggedKeys: (params: TaggedDerivationRequest) => Promise<TaggedDerivationResponse>;
    // getTaggedKeys: (params: GetTaggedKeysRequest) => Promise<TaggedDerivationResponse[] | undefined>;
    // inscribe: (params: InscribeRequest[]) => Promise<SendTbcResponse | undefined>;
};
