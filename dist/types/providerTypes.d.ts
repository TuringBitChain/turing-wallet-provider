export type PubKey = {
  tbcPubKey: string;
};

export type Address = {
  tbcAddress?: string;
  btcAddress?: string;
  ethAddress?: string;
  bnbAddress?: string;
};

export type ConnectResponse = Address;

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
  | "FTLP_MERGE"
  | "STABLECOIN_CREATE"
  | "STABLECOIN_MINT"
  | "STABLECOIN_TRANSFER"
  | "STABLECOIN_FREEZE"
  | "STABLECOIN_UNFREEZE"
  | "STABLECOIN_MERGE";


export type SendTransaction = {
  flag: TransactionFlag;
  satoshis?: number | string;
  address?: string;
  collection_data?: string;
  ft_data?: string;
  nft_data?: string;
  collection_id?: string;
  nft_contract_address?: string;
  ft_contract_address?: string;
  tbc_amount?: number | string;
  ft_amount?: number | string;
  merge_times?: number;
  with_lock?: boolean;
  lpCostAddress?: string;
  lpCostAmount?: number | string;
  pubKeyLock?: string[];
  poolNFT_version?: 1 | 2;
  serviceFeeRate?: number;
  serviceProvider_flag?: string;
  lpPlan?: 1 | 2;
  domain?: string;
  isLockTime?: boolean;
  lockTime?: number | string;
  broadcastEnabled?: boolean;
  mint_message?: string;
  utxo_txid?: string;
  utxo_index?: number;
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
  dependsOn?: string;
};

export type BatchResponse = Array<
  | SendTransactionResponse
  | SignMessageResponse
  | SignTransactionResponse
  | SignAssociatedTransactionResponse
  | EncryptResponse
  | DecryptResponse
>;

export type EvmSendTransaction = {
  chainId: number;
  contractAddress?: string;
  toAddress: string;
  amount: string;
  broadcastEnabled?: boolean;
};

export type EvmSendTransactionResponse = {
  txid?: string;
  txraw?: string;
  error?: string;
};

export type EvmProvider = {
  sendTransaction: (params: EvmSendTransaction) => Promise<EvmSendTransactionResponse | undefined>;
};

export type BtcSendTransaction = {
  toAddress: string;
  amount: string;
  broadcastEnabled?: boolean;
};

export type BtcSendTransactionResponse = {
  txid?: string;
  txraw?: string;
  error?: string;
};

export type BtcSigHashType = "legacy" | "segwit_v0" | "taproot";

export type BtcSignTransaction = {
  txHex: string;
  type: BtcSigHashType;
  prevOutScriptsHex: string[];
  values?: number[];
  leafHashesHex?: (string | undefined)[];
};

export type BtcSignTransactionResponse = {
  sigs?: string[];
  error?: string;
};

export type BtcBatchRequestMethod = "sendTransaction" | "signTransaction";

export type BtcBatchRequest = {
  method: BtcBatchRequestMethod;
  params: BtcSendTransaction | BtcSignTransaction;
};

export type BtcBatchResponse = Array<
  BtcSendTransactionResponse | BtcSignTransactionResponse
>;

export type BtcProvider = {
  sendTransaction: (params: BtcSendTransaction) => Promise<BtcSendTransactionResponse | undefined>;
  signTransaction: (params: BtcSignTransaction) => Promise<BtcSignTransactionResponse | undefined>;
  sendBatchRequest: (requests: BtcBatchRequest[]) => Promise<BtcBatchResponse | undefined>;
};

export type TuringProviderType = {
  isReady: boolean;
  connect: () => Promise<ConnectResponse | undefined>;
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
  evm: EvmProvider;
  btc: BtcProvider;
};
