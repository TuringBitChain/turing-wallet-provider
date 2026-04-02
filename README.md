# connect

> **注意**: 此包仅适用于 React 框架。其他框架请参考 [docs.turingwallet.xyz](https://docs.turingwallet.xyz)

```ts
npm install turing-wallet-provider@latest

import { TuringProvider } from "turing-wallet-provider";

root.render(
  <TuringProvider>
    <App />
  </TuringProvider>
);
```

```ts
import { useTuringWallet } from "turing-wallet-provider";

const wallet = useTuringWallet();
const addresses = await wallet.connect(); 
// 返回地址对象,根据账户类型不同返回不同字段:
// BVM账户: { tbcAddress, btcAddress }
// EVM账户: { ethAddress, bnbAddress }
// 全部账户: { tbcAddress, btcAddress, ethAddress, bnbAddress }
```

## disconnect

```ts
const wallet = useTuringWallet();
const result = await wallet.disconnect(); // 返回 true/false
```

## isConnected

```ts
const wallet = useTuringWallet();
const result = await wallet.isConnected(); // 返回 true/false
```

## getPubKey

```ts
const wallet = useTuringWallet();
const { tbcPubKey } = await wallet.getPubKey(); //tbcPubKey为string类型
```

## getAddress

```ts
const wallet = useTuringWallet();
const addresses = await wallet.getAddress(); 
// 返回地址对象,根据账户类型不同返回不同字段:
// BVM账户: { tbcAddress, btcAddress }
// EVM账户: { ethAddress, bnbAddress }
// 全部账户: { tbcAddress, btcAddress, ethAddress, bnbAddress }
```

## getInfo

```ts
const wallet = useTuringWallet();
const {name,platform,version} = await wallet.getInfo();
{Turing,android,1.0.0}//示例的返回值
```

## signMessage

```ts
const wallet = useTuringWallet();
try{
    const { address, pubkey, sig, message } = await wallet.signMessage({ message: "hello world", encoding: "base64" });//encoding可为utf-8,base64,hex
}catch(error){
    console.log(error);
}

//本地验证签名
import * as tbc from "tbc-lib-js"

const msg_buf = Buffer.from(message,encoding);
const true/false = tbc.Message.verify(msg_buf,address,sig);
```

## encrypt

```ts
const wallet = useTuringWallet();
try {
  const { encryptedMessage } = await wallet.encrypt({ message });
  if (encryptedMessage) {
    console.log(encryptedMessage);
  }
} catch (error) {
  console.log(error);
}
```

## decrypt

```ts
const wallet = useTuringWallet();
try {
  const { decryptedMessage } = await wallet.decrypt({ message });
  if (decryptedMessage) {
    console.log(decryptedMessage);
  }
} catch (error) {
  console.log(error);
}
```

## signTransaction

```ts
//使用示例
const utxosA: tbc.Transaction.IUnspentOutput[] = [];
const utxosB: tbc.Transaction.IUnspentOutput[] = [];
const utxos_satoshis: number[][] = [[], []];
const script_pubkeys: string[][] = [[], []];
const txraws: string[] = [];
const txs: tbc.Transaction[] = [];
const tx0 = new tbc.Transaction()
  .from(utxosA)
  .to(address, 100000)
  .change(address)
  .fee(80);
const tx1 = new tbc.Transaction()
  .from(utxosB)
  .to(address, 100000)
  .change(address)
  .fee(80);
txraws.push(tx0.uncheckedSerialize(), tx1.uncheckedSerialize());
for (let i = 0; i < utxosA.length; i++) {
  utxos_satoshis[0].push(utxosA[i].satoshis);
  script_pubkeys[0].push(utxosA[i].script);
}
for (let i = 0; i < utxosB.length; i++) {
  utxos_satoshis[1].push(utxosB[i].satoshis);
  script_pubkeys[1].push(utxosB[i].script);
}
const wallet = useTuringWallet();
const { sigs } = await wallet.signTransaction({
  txraws,
  utxos_satoshis,
  script_pubkeys,
});
for (let i = 0; i < utxosA.length; i++) {
  tx0.setInputScript({ inputIndex: i }, (tx) => {
    const sig = sigs[0][i];
    const sig_length = (sig.length / 2).toString(16);
    const publicKey_length = (
      publicKey.toBuffer().toString("hex").length / 2
    ).toString(16);
    return new tbc.Script(
      sig_length + sig + publicKey_length + publicKey.toString(),
    );
  });
  txs.push(tx0);
}
for (let i = 0; i < utxosB.length; i++) {
  tx1.setInputScript({ inputIndex: i }, (tx) => {
    const sig = sigs[1][i]; // Use index 1 for the second transaction
    const sig_length = (sig.length / 2).toString(16);
    const publicKey_length = (
      publicKey.toBuffer().toString("hex").length / 2
    ).toString(16);
    return new tbc.Script(
      sig_length + sig + publicKey_length + publicKey.toString(),
    );
  });
  txs.push(tx1);
}
broadcastTXsraw(txs.map((tx) => ({ txraw: tx.uncheckedSerialize() })));
```

## signAssociatedTransaction

```ts
//使用示例
interface Input {
  txId?: string;
  script?: string; //仅支持hex类型，不支持asm
  satoshis?: number;
  outputIndex: number;
  scriptSigType: "p2pkh" | "tbc20" | "tbc20_contract" | "other";
  unfinishedScriptSig?: string; // 对于"other"类型，用于提供自定义脚本(不包含交易数据的锁定脚本）模板，仅支持hex类型，不支持asm。签名部分用097369676e6174757265替代，09为7369676e6174757265长度
  ftVersion?: 1 | 2; // 对于"tbc20_contract"类型，FT版本(1或2)
  contractTxId?: string; // 对于"tbc20_contract"类型，合约交易ID
}

interface Output {
  script: string; //仅支持hex类型，不支持asm
  satoshis: number;
}

interface SignAssociatedTransactionRequestData {
  sourceTxraw: string;
  sourceUtxos: Input[];
  inputs?: Input[][];
  outputs?: Output[][];
}

//ft转移示例参数
const sourceUtxos: intput[] = [
  {
    txId: "",
    outputIndex: 0,
    satoshis: 500,
    script: ftcode,
    scriptSigType: "tbc20",
  },
  {
    txId: "",
    outputIndex: 2,
    satoshis: 10000,
    script: p2pkh,
    scriptSigType: "p2pkh",
  },
];

const inputs: intput[][] = [
  [
    { outputIndex: 0, scriptSigType: "tbc20" },
    { outputIndex: 2, scriptSigType: "p2pkh" },
  ],
  [
    { outputIndex: 0, scriptSigType: "tbc20" },
    { outputIndex: 2, scriptSigType: "p2pkh" },
  ],
];

const outputs: output[][] = [
  [
    {
      script: ftcode,
      satoshis: 500,
    },
    {
      script: fttape,
      satoshis: 0,
    },
    {
      script: p2pkh,
      satoshis: 8000,
    },
  ],
  [
    {
      script: ftcode,
      satoshis: 500,
    },
    {
      script: fttape,
      satoshis: 0,
    },
    {
      script: p2pkh,
      satoshis: 6000,
    },
  ],
];

const wallet = useTuringWallet();
const { txraws } = await wallet.signAssociatedTransaction(params);
```

## sendTransaction

使用钱包发送交易。支持多种交易类型，包括 P2PKH、NFT 操作、FT 操作和 PoolNFT 操作。

### 接口定义

```ts
interface FTData {
  name: string;
  symbol: string;
  decimal: number;
  amount: number;
}

interface CollectionData {
  collectionName: string;
  description: string;
  supply: number;
  file: string; // base64
}

interface NFTData {
  nftName: string;
  symbol: string;
  description: string;
  attributes: string;
  file?: string; // base64
}

interface RequestParam {
  flag: "P2PKH" | "COLLECTION_CREATE" | "NFT_CREATE" | "NFT_TRANSFER" | "FT_MINT" | "FT_TRANSFER" | "FT_MERGE" | "POOLNFT_MINT" | "POOLNFT_INIT" | "POOLNFT_LP_INCREASE" | "POOLNFT_LP_CONSUME" | "POOLNFT_LP_BURN" | "POOLNFT_SWAP_TO_TOKEN" | "POOLNFT_SWAP_TO_TBC" | "POOLNFT_MERGE" | "FTLP_MERGE" | "STABLECOIN_CREATE" | "STABLECOIN_MINT" | "STABLECOIN_TRANSFER" | "STABLECOIN_FREEZE" | "STABLECOIN_UNFREEZE" | "STABLECOIN_MERGE";
  address?: string;
  satoshis?: number | string;              // 单位为 satoshis，大数请使用 string
  collection_data?: string;
  ft_data?: string;
  nft_data?: string;
  collection_id?: string;
  nft_contract_address?: string;
  ft_contract_address?: string;            // FT 或稳定币合约交易 ID（稳定币的合约 ID 为 STABLECOIN_CREATE 返回的第一个 txid）
  tbc_amount?: number | string;            // 大数请使用 string
  ft_amount?: number | string;             // 大数请使用 string
  merge_times?: number;
  with_lock?: boolean;
  lpCostAddress?: string;
  lpCostAmount?: number | string;          // 大数请使用 string
  pubKeyLock?: string[];
  poolNFT_version?: 1 | 2;                // 强制为 2，若提供为别的值转为 2
  serviceFeeRate?: number;
  serverProvider_tag?: string;
  lpPlan?: 1 | 2;                          // 默认 1
  domain?: string;
  isLockTime?: boolean;
  lockTime?: number | string;              // 锁仓至指定区块高度（POOLNFT 相关），或冻结至指定 unix 时间戳（STABLECOIN_FREEZE），大数请使用 string
  broadcastEnabled?: boolean;
  mint_message?: string;                   // 铸造/增发跨链信息（STABLECOIN_CREATE / STABLECOIN_MINT 使用）
}

const params = [param: RequestParam];
```

### 返回值

- `txid` - 交易 ID（当 `broadcastEnabled` 为 `true` 时）
- `txraw` - 交易原始字符串（当 `broadcastEnabled` 为 `false` 时）
- `error` - 错误对象（发生错误时）

### P2PKH

发送标准 P2PKH 交易。

```ts
const params = [
  {
    flag: "P2PKH",               // 必填
    address: "",                  // 必填，接收地址
    satoshis: 0,                  // 必填，转账金额，单位：聪
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选，默认 api.turingbitchain.io
  },
];

const { txid } = await wallet.sendTransaction(params); // broadcastEnabled 为 true 时
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### COLLECTION_CREATE

创建新的 NFT 集合。

```ts
const params = [
  {
    flag: "COLLECTION_CREATE",    // 必填
    collection_data: "",          // 必填，JSON 格式的 CollectionData
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### NFT_CREATE

创建新的 NFT。

```ts
const params = [
  {
    flag: "NFT_CREATE",           // 必填
    collection_id: "",            // 必填，集合 ID
    nft_data: "",                 // 必填，JSON 格式的 NFTData
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### NFT_TRANSFER

将 NFT 转移到另一个地址。

```ts
const params = [
  {
    flag: "NFT_TRANSFER",         // 必填
    nft_contract_address: "",     // 必填，NFT 合约地址
    address: "",                  // 必填，接收地址
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### FT_MINT

铸造同质化代币。

```ts
const params = [
  {
    flag: "FT_MINT",              // 必填
    ft_data: "",                  // 必填，JSON 格式的 FTData
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时，返回的 txraw 有两个，用逗号隔开，需批量广播，保证前面的 txraw 先广播
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### FT_TRANSFER

转移同质化代币。

```ts
const params = [
  {
    flag: "FT_TRANSFER",          // 必填
    ft_contract_address: "",      // 必填，FT 合约地址
    address: "",                  // 必填，接收地址
    ft_amount: 0,                 // 必填，转移的 FT 数量
    tbc_amount: 0,                // 可选，同时转移 TBC 的数量，默认 0
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### FT_MERGE

合并 FT UTXO。

```ts
const params = [
  {
    flag: "FT_MERGE",             // 必填
    ft_contract_address: "",      // 必填，FT 合约地址
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params); // txid 为多个 Merge 交易的 txid，用逗号隔开
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_MINT

铸造 PoolNFT。

```ts
const params = [
  {
    flag: "POOLNFT_MINT",         // 必填
    ft_contract_address: "",      // 必填，FT 合约地址
    serverProvider_tag: "",       // 必填，服务提供商标签
    poolNFT_version: 2,           // 可选，强制为 2
    serviceFeeRate: 25,           // 可选，0-100 整数，默认 25
    with_lock: false,             // 可选，默认 false；为 true 时创建带哈希锁的池子
    pubKeyLock: ["pubkey1", "pubkey2"], // with_lock 为 true 时必填
    lpCostAddress: "",            // with_lock 为 true 时必填，扣除流动性添加成本的地址
    lpCostAmount: 0,              // with_lock 为 true 时必填，扣除流动性添加成本的 TBC 数量
    lpPlan: 1,                    // 可选，1 或 2，默认 1
    isLockTime: false,            // 可选，默认 false
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时，返回的 txraw 有两个，用逗号隔开，需批量广播，保证前面的 txraw 先广播
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_INIT

初始化 PoolNFT 池。

```ts
const params = [
  {
    flag: "POOLNFT_INIT",         // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    address: "",                  // 必填，接收地址
    tbc_amount: 0,                // 必填，初始注入的 TBC 数量
    ft_amount: 0,                 // 必填，初始注入的 FT 数量
    poolNFT_version: 2,           // 可选，强制为 2
    lockTime: 0,                  // 可选，锁定到指定的区块高度
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_LP_INCREASE

增加 PoolNFT 池中的流动性。

```ts
const params = [
  {
    flag: "POOLNFT_LP_INCREASE",  // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    address: "",                  // 必填，接收地址
    tbc_amount: 0,                // 必填，增加的 TBC 数量
    poolNFT_version: 2,           // 可选，强制为 2
    lockTime: 0,                  // 可选，锁定到指定的区块高度
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_LP_CONSUME

从 PoolNFT 池中消耗流动性。

```ts
const params = [
  {
    flag: "POOLNFT_LP_CONSUME",   // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    address: "",                  // 必填，接收地址
    ft_amount: 0,                 // 必填，消耗的 FT LP 数量
    poolNFT_version: 2,           // 可选，强制为 2
    lockTime: 0,                  // 可选，手动设置解锁参数到最大可解锁区块高度。如果启用了锁定但没有此参数，解锁参数将自动设置为（当前区块高度 - 2）
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_LP_BURN

从 PoolNFT 池中销毁流动性。

```ts
const params = [
  {
    flag: "POOLNFT_LP_BURN",      // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    poolNFT_version: 2,           // 可选，强制为 2
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_SWAP_TO_TOKEN

在 PoolNFT 池中将 TBC 交换为代币。

```ts
const params = [
  {
    flag: "POOLNFT_SWAP_TO_TOKEN", // 必填
    nft_contract_address: "",      // 必填，PoolNFT 合约地址
    address: "",                   // 必填，接收地址
    tbc_amount: 0,                 // 必填，用于交换的 TBC 数量
    poolNFT_version: 2,            // 可选，强制为 2
    lpPlan: 1,                     // 可选，1 或 2，默认 1
    broadcastEnabled: true,        // 可选，默认 true
    domain: "",                    // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_SWAP_TO_TBC

在 PoolNFT 池中将代币交换为 TBC。

```ts
const params = [
  {
    flag: "POOLNFT_SWAP_TO_TBC",  // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    address: "",                  // 必填，接收地址
    ft_amount: 0,                 // 必填，用于交换的 FT 数量
    poolNFT_version: 2,           // 可选，强制为 2
    lpPlan: 1,                    // 可选，1 或 2，默认 1
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### POOLNFT_MERGE

合并 PoolNFT 交易。

```ts
const params = [
  {
    flag: "POOLNFT_MERGE",        // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    poolNFT_version: 2,           // 可选，强制为 2
    merge_times: 10,              // 可选，1-10 次，默认 10 次，不足时提前终止
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params); // txid 为多个 Merge 交易的 txid，用逗号隔开
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### FTLP_MERGE

合并 FTLP 交易。

```ts
const params = [
  {
    flag: "FTLP_MERGE",           // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    poolNFT_version: 2,           // 可选，强制为 2
    lockTime: 0,                  // 可选，手动设置解锁参数到最大可解锁区块高度。如果启用了锁定但没有此参数，解锁参数将自动设置为（当前区块高度 - 2）
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params); // txid 为多个 Merge 交易的 txid，用逗号隔开
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### STABLECOIN_CREATE

发行稳定币合约（仅需执行一次）。稳定币继承自 FT，构造方式与 FT 相同。

```ts
const params = [
  {
    flag: "STABLECOIN_CREATE",       // 必填
    ft_data: JSON.stringify({        // 必填，JSON 格式的 FTData
      name: "USD Test",
      symbol: "USDT",
      decimal: 6,
      amount: 100000000,
    }),
    address: "",                     // 必填，初始接收地址（一般是管理员自身）
    mint_message: "SourceChain: BSC, TXID: 34434...", // 必填，跨链信息，起始链名称和交易 id
    broadcastEnabled: true,          // 可选，默认 true
    domain: "",                      // 可选
  },
];

const { txid } = await wallet.sendTransaction(params); // txid 有两个，用逗号隔开，第一个 txid 即为稳定币合约 ID
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时，返回的 txraw 有两个，用逗号隔开，第一个 txraw 对应的 txid 即为稳定币合约 ID，需批量广播，保证前面的 txraw 先广播
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### STABLECOIN_MINT

增发稳定币（仅管理员可操作）。

```ts
const params = [
  {
    flag: "STABLECOIN_MINT",         // 必填
    ft_contract_address: "",         // 必填，稳定币合约交易 ID（STABLECOIN_CREATE 返回的第一个 txid）
    address: "",                     // 必填，接收新铸稳定币的地址
    ft_amount: 50000,                // 必填，增发数量，大数请使用 string
    mint_message: "SourceChain: BSC, TXID: 34434...", // 必填，跨链信息，起始链名称和交易 id
    broadcastEnabled: true,          // 可选，默认 true
    domain: "",                      // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### STABLECOIN_TRANSFER

转移稳定币。

```ts
const params = [
  {
    flag: "STABLECOIN_TRANSFER",     // 必填
    ft_contract_address: "",         // 必填，稳定币合约交易 ID（STABLECOIN_CREATE 返回的第一个 txid）
    address: "",                     // 必填，接收地址
    ft_amount: 1000,                 // 必填，转移数量，大数请使用 string
    tbc_amount: 0,                   // 可选，同时转 TBC 和稳定币时设置此值
    broadcastEnabled: true,          // 可选，默认 true
    domain: "",                      // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### STABLECOIN_FREEZE

冻结指定地址的稳定币 UTXO（仅管理员可操作）。冻结后，持有者须等到冻结到期才能使用该 UTXO。

```ts
const params = [
  {
    flag: "STABLECOIN_FREEZE",       // 必填
    ft_contract_address: "",         // 必填，稳定币合约交易 ID（STABLECOIN_CREATE 返回的第一个 txid）
    address: "",                     // 必填，被冻结的目标地址
    lockTime: 1774410989,            // 必填，冻结至指定 unix 时间戳
    broadcastEnabled: true,          // 可选，默认 true
    domain: "",                      // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### STABLECOIN_UNFREEZE

解冻指定地址的稳定币 UTXO（仅管理员可操作）。

```ts
const params = [
  {
    flag: "STABLECOIN_UNFREEZE",     // 必填
    ft_contract_address: "",         // 必填，稳定币合约交易 ID（STABLECOIN_CREATE 返回的第一个 txid）
    address: "",                     // 必填，被解冻的目标地址
    broadcastEnabled: true,          // 可选，默认 true
    domain: "",                      // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### STABLECOIN_MERGE

合并稳定币 UTXO（要求所有 coinutxo 均已上链）。

```ts
const params = [
  {
    flag: "STABLECOIN_MERGE",        // 必填
    ft_contract_address: "",         // 必填，稳定币合约交易 ID（STABLECOIN_CREATE 返回的第一个 txid）
    domain: "",                      // 可选
  },
];

const { txid } = await wallet.sendTransaction(params); // txid 为多个 Merge 交易的 txid，用逗号隔开
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

## sendBatchRequest

批量请求功能支持一次性提交多个独立的请求，每个请求独立执行，一个请求失败不会影响其他请求的执行。

此外，当 `signMessage` 请求需要依赖 `signAssociatedTransaction` 的结果时，可以通过 `dependsOn` 字段将两者关联，详见下方[关联请求](#关联请求)章节。

**限制：** 单次批量请求最多支持 5 个请求。

### 支持的方法

- `sendTransaction` - 发送交易
- `signMessage` - 签名消息
- `signTransaction` - 签名交易
- `signAssociatedTransaction` - 签名关联交易
- `encrypt` - 加密
- `decrypt` - 解密

### 使用示例

```ts
import { useTuringWallet } from "turing-wallet-provider";

const wallet = useTuringWallet();

// 批量请求示例
const requests = [
  {
    method: "sendTransaction",
    params: {
      flag: "P2PKH",
      address: "recipient_address",
      satoshis: 10000,
      broadcastEnabled: true,
    },
  },
  {
    method: "signMessage",
    params: {
      message: "Hello World",
      encoding: "utf8",
    },
  },
  {
    method: "encrypt",
    params: {
      message: "Secret message",
    },
  },
];

const results = await wallet.sendBatchRequest(requests);
// 返回结果数组，每个元素对应一个请求的结果
```

### 批量转账示例

```ts
const batchTransfer = [
  {
    method: "sendTransaction",
    params: {
      flag: "P2PKH",
      address: "address1",
      satoshis: 10000,
      broadcastEnabled: true,
    },
  },
  {
    method: "sendTransaction",
    params: {
      flag: "P2PKH",
      address: "address2",
      satoshis: 20000,
      broadcastEnabled: true,
    },
  },
];

const results = await wallet.sendBatchRequest(batchTransfer);

// 检查结果
results.forEach((result, index) => {
  if (result.error) {
    console.error(`Request ${index + 1} failed:`, result.error);
  } else {
    console.log(`Request ${index + 1} success:`, result.txid);
  }
});
```

### 混合操作示例

```ts
const mixedOperations = [
  {
    method: "signMessage",
    params: {
      message: "Proof of ownership",
      encoding: "utf8",
    },
  },
  {
    method: "sendTransaction",
    params: {
      flag: "P2PKH",
      address: "recipient",
      satoshis: 50000,
      broadcastEnabled: true,
    },
  },
  {
    method: "encrypt",
    params: {
      message: "Sensitive data",
    },
  },
];

const results = await wallet.sendBatchRequest(mixedOperations);
```

### 关联请求

在某些场景下，`signMessage` 的消息体中需要包含 `signAssociatedTransaction` 生成的交易 txid。由于 txid 需要从签名后的 `txraws` 中计算得出，无法提前填写，因此可以在 `signMessage` 请求上添加 `dependsOn` 字段，让钱包自动完成 txid 的计算和注入。

不添加 `dependsOn` 时，`signAssociatedTransaction` 和 `signMessage` 仍然作为独立请求各自执行，互不影响。

#### 用法

批量请求固定为两个请求：第一个是 `signAssociatedTransaction`，第二个是 `signMessage`。在 `signMessage` 上添加 `dependsOn` 字段，指定将 txids 注入到消息 JSON 的哪个字段名即可。

```ts
const requests = [
  {
    method: "signAssociatedTransaction",
    params: {
      sourceTxraw: "...",
      sourceUtxos: [
        {
          txId: "",
          outputIndex: 0,
          satoshis: 500,
          script: ftcode,
          scriptSigType: "tbc20",
        },
        {
          txId: "",
          outputIndex: 2,
          satoshis: 10000,
          script: p2pkh,
          scriptSigType: "p2pkh",
        },
      ],
      inputs: [
        [
          { outputIndex: 0, scriptSigType: "tbc20" },
          { outputIndex: 2, scriptSigType: "p2pkh" },
        ],
      ],
      outputs: [
        [
          { script: ftcode, satoshis: 500 },
          { script: fttape, satoshis: 0 },
          { script: p2pkh, satoshis: 8000 },
        ],
      ],
    },
  },
  {
    method: "signMessage",
    params: {
      message: JSON.stringify({
        action: "mint",
        amount: 100,
      }),
      encoding: "utf8",
    },
    dependsOn: "txids", // 将 txids 注入到 message JSON 的 "txids" 字段
  },
];

const results = await wallet.sendBatchRequest(requests);

// results[0] => signAssociatedTransaction 的结果: { txraws: string[] }
// results[1] => signMessage 的结果: { address, pubkey, sig, message }
// 其中 message 为包含 txids 的完整 JSON，例如：
// { "action": "mint", "amount": 100, "txids": ["txid1", "txid2", ...] }
```

#### 执行流程

1. 执行 `signAssociatedTransaction`，得到 `txraws`
2. 从 `txraws` 计算出 txid 数组
3. 解析 `signMessage` 的 `message` JSON，将 txid 数组注入到 `dependsOn` 指定的字段
4. 使用注入后的完整消息执行 `signMessage`

#### 约束

- 批量请求必须恰好包含两个请求：第一个为 `signAssociatedTransaction`，第二个为 `signMessage`
- `dependsOn` 的值为字符串，表示注入到 message JSON 中的字段名
- 如果 `signAssociatedTransaction` 执行失败，`signMessage` 也会失败
- `signMessage` 的 `message` 参数必须是合法的 JSON 字符串

## evm.sendTransaction

通过 `evm` 对象发送 EVM 链上的交易,支持原生币和 ERC20 标准代币转账。

> **当前支持范围:**
>
> - 支持链: 以太坊主网(ETH)、BSC 主网(BNB)
> - 支持代币: USDT、USDC

### 参数说明

```ts
interface EvmSendTransaction {
  chainId: number; // EVM 链 ID: 1(以太坊主网) 或 56(BSC主网)
  contractAddress?: string; // ERC20 合约地址,如果为空则转账原生币(ETH/BNB)
  toAddress: string; // 接收地址
  amount: string; // 转账金额,字符串格式,单位为 token 的最小单位
  broadcastEnabled?: boolean; // 是否广播交易,默认为 true
}

interface EvmSendTransactionResponse {
  txid?: string; // 交易哈希(广播成功时返回)
  txraw?: string; // 交易原始数据(broadcastEnabled为false时返回)
  error?: string; // 错误信息
}
```

### 支持的链和代币

| 链         | chainId | 原生币 | USDT 合约地址                              | USDC 合约地址                              |
| ---------- | ------- | ------ | ------------------------------------------ | ------------------------------------------ |
| 以太坊主网 | 1       | ETH    | 0xdAC17F958D2ee523a2206206994597C13D831ec7 | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 |
| BSC 主网   | 56      | BNB    | 0x55d398326f99059fF775485246999027B3197955 | 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d |

### 使用示例

#### 转账原生币

```ts
const wallet = useTuringWallet();

// 以太坊转账 ETH
const result = await wallet.evm.sendTransaction({
  chainId: 1,
  toAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  amount: "1000000000000000000", // 1 ETH (18位小数)
  broadcastEnabled: true,
});

if (result.txid) {
  console.log("交易哈希:", result.txid);
} else if (result.error) {
  console.error("交易失败:", result.error);
}
```

#### 转账 ERC20 代币

```ts
const wallet = useTuringWallet();

// BSC 上转账 USDT
const result = await wallet.evm.sendTransaction({
  chainId: 56,
  contractAddress: "0x55d398326f99059fF775485246999027B3197955", // BSC USDT 合约
  toAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  amount: "1000000000000000000", // 1 USDT (18位小数)
  broadcastEnabled: true,
});

// 以太坊主网转账 USDC
const result2 = await wallet.evm.sendTransaction({
  chainId: 1,
  contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // ETH USDC 合约
  toAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  amount: "1000000", // 1 USDC (6位小数)
  broadcastEnabled: true,
});

if (result.txid) {
  console.log("交易哈希:", result.txid);
} else if (result.error) {
  console.error("交易失败:", result.error);
}
```

#### 不广播,仅返回签名交易

```ts
const wallet = useTuringWallet();

const result = await wallet.evm.sendTransaction({
  chainId: 1,
  toAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  amount: "1000000000000000000",
  broadcastEnabled: false, // 不广播
});

if (result.txraw) {
  console.log("交易原始数据:", result.txraw);
  // 可以自行广播这个交易
}
```

## btc.sendTransaction

通过 `btc` 对象发送 BTC 链上的交易。

### 参数说明

```ts
interface BtcSendTransaction {
  toAddress: string; // 接收地址
  amount: string; // 转账金额,字符串格式,单位为 satoshis
  broadcastEnabled?: boolean; // 是否广播交易,默认为 true
}

interface BtcSendTransactionResponse {
  txid?: string; // 交易哈希(广播成功时返回)
  txraw?: string; // 交易原始数据(broadcastEnabled为false时返回)
  error?: string; // 错误信息
}
```

### 使用示例

#### 转账 BTC

```ts
const wallet = useTuringWallet();

const result = await wallet.btc.sendTransaction({
  toAddress: "bc1qxyz...",
  amount: "100000", // 100000 satoshis
  broadcastEnabled: true,
});

if (result.txid) {
  console.log("交易哈希:", result.txid);
} else if (result.error) {
  console.error("交易失败:", result.error);
}
```

#### 不广播,仅返回签名交易

```ts
const wallet = useTuringWallet();

const result = await wallet.btc.sendTransaction({
  toAddress: "bc1qxyz...",
  amount: "100000",
  broadcastEnabled: false,
});

if (result.txraw) {
  console.log("交易原始数据:", result.txraw);
}
```

## btc.signTransaction

通过 `btc` 对象对单个 BTC 裸交易进行签名,支持 legacy、segwit_v0、taproot 三种签名类型。taproot 类型下通过 `leafHashesHex` 区分 key path 和 script path:对应输入为 `undefined` 则走 key path,有值则走 script path。

### 参数说明

```ts
type BtcSigHashType = "legacy" | "segwit_v0" | "taproot";

interface BtcSignTransaction {
  txHex: string; // 裸交易 hex
  type: BtcSigHashType; // 签名哈希类型
  prevOutScriptsHex: string[]; // 每个输入对应的前置输出脚本 hex
  values?: number[]; // 每个输入对应的金额(satoshis),segwit_v0/taproot 必填
  leafHashesHex?: (string | undefined)[]; // 每个输入对应的叶子哈希,仅 taproot 类型使用,undefined 表示 key path,有值表示 script path
}

interface BtcSignTransactionResponse {
  sigs?: string[]; // 每个输入对应的签名 hex
  error?: string; // 错误信息
}
```

### 使用示例

#### Legacy (P2PKH) 签名

```ts
const wallet = useTuringWallet();

const result = await wallet.btc.signTransaction({
  txHex: "0200000001...",
  type: "legacy",
  prevOutScriptsHex: ["76a914...88ac"],
});

if (result.sigs) {
  console.log("签名列表:", result.sigs);
} else if (result.error) {
  console.error("签名失败:", result.error);
}
```

#### SegWit V0 (P2WPKH) 签名

```ts
const wallet = useTuringWallet();

const result = await wallet.btc.signTransaction({
  txHex: "0200000001...",
  type: "segwit_v0",
  prevOutScriptsHex: ["76a914...88ac"],
  values: [100000],
});

if (result.sigs) {
  console.log("签名列表:", result.sigs);
}
```

#### Taproot Key Path 签名

```ts
const wallet = useTuringWallet();

const result = await wallet.btc.signTransaction({
  txHex: "0200000001...",
  type: "taproot",
  prevOutScriptsHex: ["5120..."],
  values: [100000],
  // leafHashesHex 不传或对应位置为 undefined,走 key path
});

if (result.sigs) {
  console.log("签名列表:", result.sigs);
}
```

#### Taproot Script Path 签名

```ts
const wallet = useTuringWallet();

const result = await wallet.btc.signTransaction({
  txHex: "0200000001...",
  type: "taproot",
  prevOutScriptsHex: ["5120..."],
  values: [100000],
  leafHashesHex: ["ab12cd34..."], // 对应输入有 leafHash,走 script path
});

if (result.sigs) {
  console.log("签名列表:", result.sigs);
}
```

## btc.sendBatchRequest

通过 `btc` 对象批量提交 BTC 相关请求,每个请求独立执行,一个失败不影响其他请求。

### 支持的方法

- `sendTransaction` - 发送交易
- `signTransaction` - 签名交易

### 参数说明

```ts
type BtcBatchRequestMethod = "sendTransaction" | "signTransaction";

interface BtcBatchRequest {
  method: BtcBatchRequestMethod;
  params: BtcSendTransaction | BtcSignTransaction;
}

type BtcBatchResponse = Array<BtcSendTransactionResponse | BtcSignTransactionResponse>;
```

### 使用示例

```ts
const wallet = useTuringWallet();

const requests = [
  {
    method: "sendTransaction",
    params: {
      toAddress: "bc1qxyz...",
      amount: "100000",
      broadcastEnabled: true,
    },
  },
  {
    method: "signTransaction",
    params: {
      txHex: "0200000001...",
      type: "legacy",
      prevOutScriptsHex: ["76a914...88ac"],
    },
  },
];

const results = await wallet.btc.sendBatchRequest(requests);

results.forEach((result, index) => {
  if (result.error) {
    console.error(`Request ${index + 1} failed:`, result.error);
  } else {
    console.log(`Request ${index + 1} success:`, result);
  }
});
```
