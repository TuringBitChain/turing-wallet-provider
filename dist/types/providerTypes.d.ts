export type PubKey = {
  tbcPubKey: string;
};

export type Address = {
  tbcAddress: string;
};

export type Info = {
  name: string;
  platform: string;
  version: string;
};

export type TransactionFlag =
  | "P2PKH"
  | "COLLECTION_CREATE"
  | "NFT_CREATE"
  | "NFT_TRANSFER"
  | "FT_MINT"
  | "FT_TRANSFER"
  | "FT_MERGE"
  | "POOLNFT_MINT"
  | "POOLNFT_INIT"
  | "POOLNFT_LP_INCREASE"
  | "POOLNFT_LP_CONSUME"
  | "POOLNFT_LP_BURN"
  | "POOLNFT_SWAP_TO_TOKEN"
  | "POOLNFT_SWAP_TO_TBC"
  | "POOLNFT_MERGE"
  | "FTLP_MERGE";


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
  with_lock?: boolean;
  lpCostAddress?: string;
  lpCostAmount?: number;
  pubKeyLock?: string[];
  poolNFT_version?: number;
  serviceFeeRate?: number;
  serviceProvider_flag?: string;
  lpPlan?: number;
  domain?: string;
  isLockTime?: boolean;
  lockTime?: number;
  broadcastEnabled?: boolean;
};

export type SendTransactionResponse = {
  txid?: string;
  txraw?: string;
  error?: string;
};

export type SignTransaction = {
  txraws: string[];
  utxos_satoshis: number[][];
  script_pubkeys: string[][];
};

export type SignTransactionResponse = {
  sigs?: string[][];
  error?: string;
};

export type SignMessage = {
  message: string;
  encoding: "utf8" | "hex" | "base64";
};

export type SignMessageResponse = {
  maddress?: string;
  pubkey?: string;
  message?: string;
  sig?: string;
  error?: string;
};

export type Encrypt = {
  message: string;
};

export type Decrypt = {
  message: string;
};

export type EncryptResponse = {
  encryptedMessage?: string;
  error?: string;
};

export type DecryptResponse = {
  decryptedMessage?: string;
  error?: string;
};

export type Input = {
  txId?: string;
  script?: string;
  satoshis?: number;
  outputIndex: number;
  scriptSigType: "p2pkh" | "tbc20" | "tbc20_contract" | "other";
  unfinishedScriptSig?: string;
  ftVersion?: 1 | 2;
  contractTxId?: string;
};

export type Output = {
  script: string;
  satoshis: number;
};

export type SignAssociatedTransaction = {
  sourceTxraw: string;
  sourceUtxos: Input[];
  inputs?: Input[][];
  outputs?: Output[][];
};

export type SignAssociatedTransactionResponse = {
  txraws?: string[];
  error?: string;
};

export type BatchRequestMethod =
  | "sendTransaction"
  | "signMessage"
  | "signTransaction"
  | "signAssociatedTransaction"
  | "encrypt"
  | "decrypt";

export type BatchRequest = {
  method: BatchRequestMethod;
  params: SendTransaction | SignMessage | SignTransaction | SignAssociatedTransaction | Encrypt | Decrypt;
};

export type BatchResponse = Array<
  | SendTransactionResponse
  | SignMessageResponse
  | SignTransactionResponse
  | SignAssociatedTransactionResponse
  | EncryptResponse
  | DecryptResponse
>;

export type TuringProviderType = {
  isReady: boolean;
  connect: () => Promise<string | undefined>;
  disconnect: () => Promise<boolean>;
  isConnected: () => Promise<boolean>;
  getPubKey: () => Promise<PubKey | undefined>;
  getAddress: () => Promise<Address | undefined>;
  getInfo: () => Promise<Info | undefined>;
  sendTransaction: (
    params: SendTransaction[]
  ) => Promise<SendTransactionResponse | undefined>;
  signTransaction: (
    params: SignTransaction
  ) => Promise<SignTransactionResponse | undefined>;
  signMessage: (
    params: SignMessage
  ) => Promise<SignMessageResponse | undefined>;
  encrypt: (params: Encrypt) => Promise<EncryptResponse | undefined>;
  decrypt: (params: Decrypt) => Promise<DecryptResponse | undefined>;
  signAssociatedTransaction: (
    params: SignAssociatedTransaction
  ) => Promise<SignAssociatedTransactionResponse | undefined>;
  sendBatchRequest: (requests: BatchRequest[]) => Promise<BatchResponse | undefined>;
};
