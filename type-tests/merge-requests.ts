import type {
  BatchRequest,
  SendTransaction,
} from "../dist";

const nonMergeRequest: SendTransaction = {
  flag: "P2PKH",
  broadcastEnabled: false,
  merge_times: 1,
  poolNFT_version: 2,
  lockTime: "100",
};

const ftMergeRequest: SendTransaction = {
  flag: "FT_MERGE",
  ft_contract_address: "ft-contract",
};

const stablecoinMergeRequest: SendTransaction = {
  flag: "STABLECOIN_MERGE",
  ft_contract_address: "stablecoin-contract",
  domain: "https://api.example.com",
};

const poolNftMergeRequest: SendTransaction = {
  flag: "POOLNFT_MERGE",
  nft_contract_address: "pool-nft-contract",
};

const ftLpMergeRequest: SendTransaction = {
  flag: "FTLP_MERGE",
  nft_contract_address: "pool-nft-contract",
  domain: "https://api.example.com",
};

// @ts-expect-error FT merge requires its FT contract address.
const ftMergeWithoutContract: SendTransaction = { flag: "FT_MERGE" };

// @ts-expect-error Stablecoin merge requires its FT contract address.
const stablecoinMergeWithoutContract: SendTransaction = { flag: "STABLECOIN_MERGE" };

// @ts-expect-error PoolNFT merge requires its NFT contract address.
const poolNftMergeWithoutContract: SendTransaction = { flag: "POOLNFT_MERGE" };

// @ts-expect-error FTLP merge requires its NFT contract address.
const ftLpMergeWithoutContract: SendTransaction = { flag: "FTLP_MERGE" };

// @ts-expect-error Dedicated merge always broadcasts.
const mergeWithBroadcastControl: SendTransaction = { flag: "FT_MERGE", ft_contract_address: "ft-contract", broadcastEnabled: false };

// @ts-expect-error Merge count is not part of the public merge request.
const mergeWithMergeTimes: SendTransaction = { flag: "STABLECOIN_MERGE", ft_contract_address: "stablecoin-contract", merge_times: 2 };

// @ts-expect-error Pool version is not part of the public merge request.
const mergeWithPoolVersion: SendTransaction = { flag: "POOLNFT_MERGE", nft_contract_address: "pool-nft-contract", poolNFT_version: 2 };

// @ts-expect-error Lock time is not part of the public merge request.
const mergeWithLockTime: SendTransaction = { flag: "FTLP_MERGE", nft_contract_address: "pool-nft-contract", lockTime: 100 };

// @ts-expect-error FT merge exposes only its FT contract address and optional domain.
const ftMergeWithNftContract: SendTransaction = { flag: "FT_MERGE", ft_contract_address: "ft-contract", nft_contract_address: "pool-nft-contract" };

// @ts-expect-error PoolNFT merge exposes only its NFT contract address and optional domain.
const poolMergeWithFtContract: SendTransaction = { flag: "POOLNFT_MERGE", nft_contract_address: "pool-nft-contract", ft_contract_address: "ft-contract" };

// @ts-expect-error Merge transactions are not supported in batch requests.
const batchMergeRequest: BatchRequest = { method: "sendTransaction", params: ftMergeRequest };

void [
  nonMergeRequest,
  ftMergeRequest,
  stablecoinMergeRequest,
  poolNftMergeRequest,
  ftLpMergeRequest,
  ftMergeWithoutContract,
  stablecoinMergeWithoutContract,
  poolNftMergeWithoutContract,
  ftLpMergeWithoutContract,
  mergeWithBroadcastControl,
  mergeWithMergeTimes,
  mergeWithPoolVersion,
  mergeWithLockTime,
  ftMergeWithNftContract,
  poolMergeWithFtContract,
  batchMergeRequest,
];
