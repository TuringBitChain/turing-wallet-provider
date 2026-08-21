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

## getNetwork

获取已连接账户当前激活的网络。

### 用法

```ts
const wallet = useTuringWallet();
const network = await wallet.getNetwork();
```

### 参数

该方法不接受任何参数。

### 返回值

```ts
interface GetNetworkResponse {
  network: "tbc" | "btc" | "eth" | "bnb" | "all";
  type: "mainnet" | "testnet";
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `network` | `"tbc" \| "btc" \| "eth" \| "bnb" \| "all"` | 当前激活的链。`"all"` 表示用户处于钱包的"所有网络"视图，未选择具体的链。 |
| `type` | `"mainnet" \| "testnet"` | 主网 / 测试网。仅 `tbc` 可能为 `"testnet"`，其余链恒为 `"mainnet"`。 |

### 错误处理

| 错误 | 原因 |
| --- | --- |
| `User not connected` | 尚未调用 `wallet.connect()`，或用户已断开连接。 |

```ts
const wallet = useTuringWallet();

try {
  const info = await wallet.getNetwork();
  console.log(info);
} catch (error) {
  console.error("Failed to get network:", error);
}
```

### 订阅变化

钱包内切换网络时，dapp 会收到 `TuringNetworkChanged` 事件并附带新的网络信息，无需轮询 `getNetwork()`。

```ts
window.addEventListener("TuringNetworkChanged", (event) => {
  const { network } = event.detail;
  // `network` 与 wallet.getNetwork() 的返回值同结构
});
```

```ts
interface TuringNetworkChangedDetail {
  network: GetNetworkResponse;
}
```

仅在 dapp 已连接期间触发，且只推送 `connect()` 之后的变化（初始网络可通过 `wallet.getNetwork()` 获取）。

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

使用钱包签名父子（关联）交易。钱包根据源交易构建子交易并统一签名。

### 用法

```ts
const { txraws } = await Turing.signAssociatedTransaction({
  sourceTxraw,
  sourceUtxos,
  inputs,
  outputs,
});
```

### 参数

```ts
interface Input {
  txId?: string;               // 交易 ID（源交易输入需提供）
  script?: string;             // 锁定脚本，仅支持 hex 格式
  satoshis?: number;           // satoshi 值
  outputIndex: number;         // 输出索引
  scriptSigType:
    | "p2pkh"
    | "tbc20"                  // 普通 FT 转账解锁
    | "tbc20_contract"         // 普通 FT 在合约/swap 场景下的解锁
    | "tbc20_coin"             // 稳定币转账解锁（FT.getFTunlock + isCoin）
    | "tbc20_coin_contract"    // 稳定币在合约/swap 场景下的解锁（FT.getFTunlockSwap + isCoin）
    | "other";                 // 脚本签名类型
  unfinishedScriptSig?: string;  // "other" 类型的自定义脚本模板（hex 格式），签名部分用 097369676e6174757265 替代
  ftVersion?: 1 | 2 | 3;       // "tbc20_contract" / "tbc20_coin_contract" 类型的 FT 版本
  contractTxId?: string;       // "tbc20_contract" / "tbc20_coin_contract" 类型的合约交易 ID
}

interface Output {
  script: string;    // 输出锁定脚本，仅支持 hex 格式
  satoshis: number;  // 输出的 satoshi 值
}

interface SignAssociatedTransactionRequestData {
  sourceTxraw: string;      // 源头交易的原始 hex 字符串
  sourceUtxos: Input[];     // 源头交易的 UTXO 数组
  inputs?: Input[][];       // 子交易输入的二维数组
  outputs?: Output[][];     // 子交易输出的二维数组
}
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `sourceTxraw` | `string` | 是 | 源头交易的原始 hex 字符串 |
| `sourceUtxos` | `Input[]` | 是 | 源头交易的 UTXO 数组 |
| `inputs` | `Input[][]` | 否 | 二维数组 — 每个子数组代表一个子交易的输入 |
| `outputs` | `Output[][]` | 否 | 二维数组 — 每个子数组代表一个子交易的输出 |

### 返回值

```ts
interface SignAssociatedTransactionResponse {
  txraws: string[];  // 已组装的待广播交易 hex 字符串数组（包含父子交易）
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `txraws` | `string[]` | 包含父子交易的已组装待广播交易数组 |

### 错误处理

```ts
try {
  const { txraws } = await Turing.signAssociatedTransaction({
    sourceTxraw,
    sourceUtxos,
    inputs,
    outputs,
  });
  console.log("交易:", txraws);
} catch (error) {
  console.error("签名失败:", error);
}
```

### 示例

FT 转移示例：

```ts
const sourceUtxos: Input[] = [
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

const inputs: Input[][] = [
  [
    { outputIndex: 0, scriptSigType: "tbc20" },
    { outputIndex: 2, scriptSigType: "p2pkh" },
  ],
  [
    { outputIndex: 0, scriptSigType: "tbc20" },
    { outputIndex: 2, scriptSigType: "p2pkh" },
  ],
];

const outputs: Output[][] = [
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

const { txraws } = await Turing.signAssociatedTransaction({
  sourceTxraw,
  sourceUtxos,
  inputs,
  outputs,
});
```

### 稳定币转移 (tbc20_coin)

稳定币是一种特殊的 FT，转移时的解锁脚本与普通 FT 不同，所以提供了专用的 `scriptSigType`：

- `"tbc20_coin"`：稳定币普通转账解锁
- `"tbc20_coin_contract"`：稳定币在合约/swap 场景下的解锁（需额外提供 `contractTxId` 和 `ftVersion`）

#### 子交易 (`inputs` / `outputs`)

只要把对应输入的 `scriptSigType` 标成 `"tbc20_coin"`（合约场景用 `"tbc20_coin_contract"` 并补充 `contractTxId` / `ftVersion`）即可，**其它字段与普通 FT 写法完全一致**，无需关心 sequence / nLockTime。

#### 源交易 (`sourceTxraw`)

`sourceTxraw` 是调用方自己组装好的原始交易，**如果里面包含稳定币输入**，必须在构建时自行满足以下两个条件：

1. 每个稳定币输入的 `sequence` 设为 `0xFFFFFFFE`
2. 整笔交易的 `nLockTime` 设为所有被花费稳定币 UTXO tape 中 `lockTime` 的最大值

参考写法：

```ts
import { Transaction } from "tbc-lib-js";
import { stableCoin } from "tbc-contract";

const tx = new Transaction().from(coinUtxos).from(payUtxo);
// ...addOutput(...)

for (let i = 0; i < coinUtxos.length; i++) {
  tx.setInputSequence(i, 0xFFFFFFFE);
}

let lockTimeMax = 0;
for (let i = 0; i < coinUtxos.length; i++) {
  const lt = stableCoin.getLockTimeFromTape(
    preTXs[i].outputs[coinUtxos[i].outputIndex + 1].script
  );
  lockTimeMax = Math.max(lockTimeMax, lt);
}
tx.setLockTime(lockTimeMax);

const sourceTxraw = tx.uncheckedSerialize();
```

> 对应的 `sourceUtxos` 条目仍要填 `"tbc20_coin"`。

#### 稳定币示例

父交易花掉 1 个稳定币 UTXO + 1 个 P2PKH UTXO，产生新的稳定币 UTXO（output 0/1 为 code/tape，output 2 为 P2PKH 找零）；子交易再次花掉这个新稳定币 UTXO：

```ts
const sourceUtxos: Input[] = [
  {
    txId: coinUtxo.txId,
    outputIndex: coinUtxo.outputIndex,
    satoshis: 500,
    script: coinCodeHex,
    scriptSigType: "tbc20_coin",
  },
  {
    txId: payUtxo.txId,
    outputIndex: payUtxo.outputIndex,
    satoshis: 10000,
    script: p2pkhHex,
    scriptSigType: "p2pkh",
  },
];

const inputs: Input[][] = [
  [
    { outputIndex: 0, scriptSigType: "tbc20_coin" },
    { outputIndex: 2, scriptSigType: "p2pkh" },
  ],
];

const outputs: Output[][] = [
  [
    { script: newCoinCodeHex, satoshis: 500 },
    { script: newCoinTapeHex, satoshis: 0 },
    { script: p2pkhChangeHex, satoshis: 8000 },
  ],
];

const { txraws } = await Turing.signAssociatedTransaction({
  sourceTxraw,
  sourceUtxos,
  inputs,
  outputs,
});
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

type TransactionFlag =
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
  | "STABLECOIN_TRANSFER"
  | "STABLECOIN_MERGE";

type MergeTransactionFlag =
  | "FT_MERGE"
  | "STABLECOIN_MERGE"
  | "POOLNFT_MERGE"
  | "FTLP_MERGE";

type NonMergeTransactionFlag = Exclude<TransactionFlag, MergeTransactionFlag>;

interface NonMergeRequestParam {
  flag: NonMergeTransactionFlag;
  address?: string;
  satoshis?: number | string;              // 单位为 satoshis，大数请使用 string
  collection_data?: string;
  ft_data?: string;
  nft_data?: string;
  collection_id?: string;
  nft_contract_address?: string;
  ft_contract_address?: string;            // FT 或稳定币合约交易 ID
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
  lpPlan?: 1 | 2 | 3 | 4 | 5 | 6;           // 创建池默认 1；Swap 可省略并由钱包从链上识别
  domain?: string;
  isLockTime?: boolean;
  lockTime?: number | string;              // 锁仓至指定区块高度（POOLNFT 相关），大数请使用 string
  broadcastEnabled?: boolean;
}

type MergeRequestParam =
  | {
      flag: "FT_MERGE";
      ft_contract_address: string;
      domain?: string;
    }
  | {
      flag: "STABLECOIN_MERGE";
      ft_contract_address: string;
      domain?: string;
    }
  | {
      flag: "POOLNFT_MERGE";
      nft_contract_address: string;
      domain?: string;
    }
  | {
      flag: "FTLP_MERGE";
      nft_contract_address: string;
      domain?: string;
    };

type RequestParam = NonMergeRequestParam | MergeRequestParam;

const params = [param: RequestParam];
```

### 返回值

- `txid` - 交易 ID（当 `broadcastEnabled` 为 `true` 时）
- `txraw` - 交易原始字符串（当 `broadcastEnabled` 为 `false` 时）
- `error` - 错误对象（发生错误时）

专用 Merge 请求始终由钱包广播，成功时返回 `txid`。Merge 请求不接受 `broadcastEnabled`，也不支持通过 `sendBatchRequest` 提交。

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

钱包会根据链上 NFT 输出自动识别 v0、v1 或 v2 并选择对应的转移方法。DApp 不需要也不应传 NFT 版本参数。

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

钱包会根据链上父输出自动识别 FT v1–v4 并选择对应的转移方法。DApp 不需要传 FT 版本参数。

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

const { txid } = await wallet.sendTransaction(params);
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
    serviceFeeRate: 130,          // 可选；必须与 lpPlan 对应，Plan 6 为 130（1.30%）
    with_lock: false,             // 可选，默认 false；为 true 时创建带哈希锁的池子
    pubKeyLock: ["pubkey1", "pubkey2"], // with_lock 为 true 时必填
    lpCostAddress: "",            // with_lock 为 true 时必填，扣除流动性添加成本的地址
    lpCostAmount: 0,              // with_lock 为 true 时必填，扣除流动性添加成本的 TBC 数量
    lpPlan: 6,                    // 可选，1-6，默认 1
    isLockTime: false,            // 可选，默认 false
    broadcastEnabled: true,       // 可选，默认 true
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { txraw } = await wallet.sendTransaction(params); // broadcastEnabled 为 false 时，返回的 txraw 有两个，用逗号隔开，需批量广播，保证前面的 txraw 先广播
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

各方案的规范服务费率（基点）为：Plan 1 = 35、Plan 2 = 35、Plan 3 = 135、Plan 4 = 335、Plan 5 = 535、Plan 6 = 130。创建池时若省略 `serviceFeeRate`，钱包会根据 `lpPlan` 自动填入；显式传入时必须与方案一致。

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
    lpPlan: 6,                     // 可选；Plan 6 池可传 6，省略时钱包从链上池状态识别
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
    lpPlan: 6,                    // 可选；Plan 6 池可传 6，省略时钱包从链上池状态识别
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
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### FTLP_MERGE

合并 FTLP 交易。

```ts
const params = [
  {
    flag: "FTLP_MERGE",           // 必填
    nft_contract_address: "",     // 必填，PoolNFT 合约地址
    domain: "",                   // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

### STABLECOIN_TRANSFER

转移稳定币。

```ts
const params = [
  {
    flag: "STABLECOIN_TRANSFER",     // 必填
    ft_contract_address: "",         // 必填，稳定币合约交易 ID
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

### STABLECOIN_MERGE

合并稳定币 UTXO。

```ts
const params = [
  {
    flag: "STABLECOIN_MERGE",        // 必填
    ft_contract_address: "",         // 必填，稳定币合约交易 ID
    domain: "",                      // 可选
  },
];

const { txid } = await wallet.sendTransaction(params);
// const { error } = await wallet.sendTransaction(params); // 发生错误时
```

## sendBatchRequest

批量请求功能支持一次性提交多个独立的请求，每个请求独立执行，一个请求失败不会影响其他请求的执行。

此外，当 `signMessage` 请求需要依赖 `signAssociatedTransaction` 的结果时，可以通过 `dependsOn` 字段将两者关联，详见下方[关联请求](#关联请求)章节。

**限制：** 单次批量请求最多支持 5 个请求。Merge 请求不支持批量提交，请直接调用 `sendTransaction`。

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

在某些场景下，`signMessage` 的消息体中需要包含前一个请求生成的交易 txid。由于 txid 在请求前无法确定，因此可以在 `signMessage` 请求上添加 `dependsOn` 字段，让钱包自动完成 txid 的提取和注入。

不添加 `dependsOn` 时，两个请求仍然作为独立请求各自执行，互不影响。

#### 支持的第一个方法

| 方法 | txid 提取方式 |
| --- | --- |
| `signAssociatedTransaction` | 从返回的 `txraws: string[]` 中计算每个 txraw 的 txid |
| `sendTransaction` | `broadcastEnabled: true` 时从返回的 `txid` 按逗号拆分；`broadcastEnabled: false` 时从返回的 `txraw` 按逗号拆分后计算 txid |

无论哪种方法，最终注入到 `signMessage` 的 `message` JSON 中的都是一个 **txid 字符串数组**。

#### 用法

批量请求固定为两个请求：第一个是 `signAssociatedTransaction` 或 `sendTransaction`，第二个是 `signMessage`。在 `signMessage` 上添加 `dependsOn` 字段，指定将 txids 注入到消息 JSON 的哪个字段名即可。

#### 示例一：signAssociatedTransaction + signMessage

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

#### 示例二：sendTransaction + signMessage

```ts
const requests = [
  {
    method: "sendTransaction",
    params: {
      flag: "STABLECOIN_TRANSFER",
      ft_contract_address: "",
      address: "",
      ft_amount: 1000,
      broadcastEnabled: true,
      domain: "",
    },
  },
  {
    method: "signMessage",
    params: {
      message: JSON.stringify({
        action: "transfer_stablecoin",
      }),
      encoding: "utf8",
    },
    dependsOn: "txids", // 将 txids 注入到 message JSON 的 "txids" 字段
  },
];

const results = await wallet.sendBatchRequest(requests);

// results[0] => sendTransaction 的结果: { txid: "txid1" }
// results[1] => signMessage 的结果: { address, pubkey, sig, message }
// 其中 message 为包含 txids 的完整 JSON，例如：
// { "action": "transfer_stablecoin", "txids": ["txid1"] }
```

#### 执行流程

1. 执行第一个请求（`signAssociatedTransaction` 或 `sendTransaction`）
2. 从结果中提取 txid 数组：
   - `signAssociatedTransaction`：从 `txraws` 计算每个 txraw 的 txid
   - `sendTransaction`（`broadcastEnabled: true`）：将 `txid` 按逗号拆分
   - `sendTransaction`（`broadcastEnabled: false`）：将 `txraw` 按逗号拆分后计算 txid
3. 解析 `signMessage` 的 `message` JSON，将 txid 数组注入到 `dependsOn` 指定的字段
4. 使用注入后的完整消息执行 `signMessage`

#### 约束

- 批量请求必须恰好包含两个请求：第一个为 `signAssociatedTransaction` 或 `sendTransaction`，第二个为 `signMessage`
- `dependsOn` 的值为字符串，表示注入到 message JSON 中的字段名
- 如果第一个请求执行失败，`signMessage` 也会失败
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
