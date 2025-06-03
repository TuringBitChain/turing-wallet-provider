export type PubKey = {
  tbcPubKey: string;
};

export type Address = {
  tbcAddress: string;
};

export type Balance = {
  tbc: number;
};

export type Info = {
  name: string;
  platform: string;
  version: string;
}

export type SignedMessage = {
  address: string;
  pubKey: string;
  sig: string;
  message: string;
};

export type TransactionFlag =
  | "P2PKH"
  | "COLLECTION_CREATE"
  | "NFT_CREATE"
  | "NFT_TRANSFER"
  | "FT_MINT"
  | "FT_TRANSFER"
  | "POOLNFT_MINT"
  | "POOLNFT_INIT"
  | "POOLNFT_LP_INCREASE"
  | "POOLNFT_LP_CONSUME"
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
  poolNFT_version?: number;
  serviceFeeRate?: number;
  serviceProvider_flag?: string;
  lpPlan?: number;
  domain?: string;
};

export type SignMessage = {
  message: string;
  encoding?: "utf8" | "hex" | "base64";
};

export type Utxos = {
  satoshis: number;
  script: string;
  txid: string;
  vout: number;
};

export type SendTransactionResponse = {
  txid: string;
};

export type Encrypt = {
  message: string;
};

export type Decrypt = {
  message: string;
};

export type EncryptResponse = {
  encryptedMessage: string;
};

export type DecryptResponse = {
  decryptedMessage: string;
};

export type TuringProviderType = {
  isReady: boolean;
  connect: () => Promise<string | undefined>;
  disconnect: () => Promise<boolean>;
  isConnected: () => Promise<boolean>;
  getPubKey: () => Promise<PubKey | undefined>;
  getAddress: () => Promise<Address | undefined>;
  getBalance: () => Promise<Balance | undefined>;
  getInfo: () => Promise<Info | undefined>;
  sendTransaction: (
    params: SendTransaction[]
  ) => Promise<SendTransactionResponse | undefined>;
  signMessage: (params: SignMessage) => Promise<SignedMessage | undefined>;
  getPaymentUtxos: () => Promise<Utxos[] | undefined>;
  encrypt: (params: Encrypt) => Promise<EncryptResponse | undefined>;
  decrypt: (params: Decrypt) => Promise<DecryptResponse | undefined>;
};
