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
await wallet.connect();
```

## disconnect

```ts
const wallet = useTuringWallet();
await wallet.disconnect();
```

## isConnected

```ts
const wallet = useTuringWallet();
const ture/false = await wallet.isConnected();
```

## getPubKey

```ts
const wallet = useTuringWallet();
const { tbcPubKey } = await wallet.getPubKey(); //tbcPubKey为string类型
```

## getAddress

```ts
const wallet = useTuringWallet();
const { tbcAddress } = await wallet.getAddress(); //tbcAddress为string类型
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

```ts
interface FTData {
​ name:string;
 symbol :string;
​ decimal :number;
​ amount :number;
};

interface CollectionData {
    collectionName: string;
    description: string;
    supply: number;
    file: string;//file为图片base64编码后数据
};

interface NFTData {
    nftName: string;
    symbol: string;
    description: string;
    attributes: string;
    file?: string;//file为图片base64编码后数据,若无则为引用合集图片
};

interface RequestParam = {
    flag: "P2PKH" | "COLLECTION_CREATE" | "NFT_CREATE" | "NFT_TRANSFER" | "FT_MINT" | "FT_TRANSFER" | "FT_MERGE" | "POOLNFT_MINT" | "POOLNFT_INIT" | "POOLNFT_LP_INCREASE" |"POOLNFT_LP_CONSUME"| "POOLNFT_LP_BURN" | "POOLNFT_SWAP_TO_TOKEN" | "POOLNFT_SWAP_TO_TBC" | "POOLNFT_MERGE"|"FTLP_MERGE";
    addres?: string;//交易接收者地址
    satoshis?: number;//单位为satoshis
    collection_data?: string; //json格式传
    ft_data?: string; //json格式传
    nft_data?: string; //json格式传
    collection_id?: string;
    nft_contract_address?: string;
    ft_contract_address?: string;
    tbc_amount?: number;
    ft_amount?: number;
    merge_times?:number; //可选字段 不提供默认为10
    with_lock? boolean;
    lpCostAddress?: string;//设置添加流动性扣款地址
    lpCostAmount?: number;//设置添加流动性扣款TBC数量
    pubKeyLock?: string[];
    poolNFT_version?: number; // 废弃字段强制为2，若提供为别的值转为2
    serviceFeeRate?: number; // 0-100 poolNFT_version为2有效 不提供默认为25
    serverProvider_tag?:string; //poolNFT_version为2时为必需字段 poolNFT_version为1无效
    lpPlan?:number; //1或2 不提供默认为1 lp手续费方案, 方案1: LP 0.25%  swap服务商 0.09%  协议0.01%; 方案2: LP 0.05%  swap服务商 0.29%  协议0.01%
    domain?:string; // 设置构建及广播交易使用的节点和api服务 只支持https 不提供默认值是api.turingbitchain.io
    isLockTime?: boolean;//是否具备锁仓功能
    lockTime?: number;//锁仓至lockTime区块高度
    broadcastEnabled?:boolean;//决定是否通过钱包进行广播,默认为true,选择false则钱包返回txraw而不是txid
};

const params = [param:RequestParam] //目前参数里只能放一个对象，有批量发送需求再扩展
```

### P2PKH

```ts
const params = [
  {
    flag: "P2PKH",
    satoshis: 1000,
    address: "",
    broadcastEnabled?:true,//默认为true
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);//broadcastEnabled为true
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### COLLECTION_CREATE

```ts
const params = [
  {
    flag: "COLLECTION_CREATE",
    collection_data: "",
    broadcastEnabled?:true,//默认为true
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### NFT_CREATE

```ts
const params = [
  {
    flag: "NFT_CREATE",
    nft_data: "",
    collection_id: "",
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### NFT_TRANSFER

```ts
const params = [
  {
    flag: "NFT_TRANSFER",
    nft_contract_address: "",
    address: "",
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### FT_MINT

```ts
const params = [
  {
    flag: "FT_MINT",
    ft_data: "",
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### FT_TRANSFER

```ts
const params = [
  {
    flag: "FT_TRANSFER",
    ft_contract_address: "",
    ft_amount: 0.1,
    address: "",
    tbc_amount?: 1, //同时转ft和tbc时候可提供参数
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### FT_MERGE

```ts
const params = [
  {
    flag: "FT_MERGE",
    ft_contract_address: "",
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);//txid为多个Merge交易的txid之间用逗号隔开
//const { error } = await wallet.sendTransaction(params);广播交易时出现错误
```

### POOLNFT_MINT

```ts
const params = [
  {
    flag: "POOLNFT_MINT",
    ft_contract_address: "",
    poolNFT_version?: 2,
    serverProvider_tag？: "",
    serviceFeeRate?: 25, // poolNFT_version为2时此参数有效，默认为25
    with_lock?: false, //默认值为false，为true则创建带哈希锁的poolNFT
    pubKeyLock?: ["pubkey1", "pubkey2"],
    lpCostAddress?: "", //设置添加流动性扣款地址
    lpCostAmount?: 5, //设置添加流动性扣款TBC数量
    lpPlan?: 1, //默认值为1
    isLockTime?: false, //是否具备锁仓功能 默认为false
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### POOLNFT_INIT

```ts
const params = [
  {
    flag: "POOLNFT_INIT",
    nft_contract_address: "",
    address: "",
    tbc_amount: 30,
    ft_amount: 1000,
    poolNFT_version?: 2,
    lockTime?: 900000, //锁仓至指定区块高度
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### POOLNFT_LP_INCREASE

```ts
const params = [
  {
    flag: "POOLNFT_LP_INCREASE",
    nft_contract_address: "",
    address: "",
    tbc_amount: 3,
    poolNFT_version?: 2,
    lockTime?: 900000, //锁仓至指定区块高度
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### POOLNFT_LP_CONSUME

```ts
const params = [
  {
    flag: "POOLNFT_LP_CONSUME",
    nft_contract_address: "",
    address: "",
    ft_amount: 100,
    poolNFT_version?: 2,
    lockTime?: 900000, //用于手动设置解锁参数，设置为可解锁的最大高度。若不带此参数情况下若带有锁仓，会自动设置解锁参数为 (当前区块高度 - 2)
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### POOLNFT_LP_BURN

```ts
const params = [
  {
    flag: "POOLNFT_LP_BURN",
    nft_contract_address: "",
    poolNFT_version?: 2, //默认为2.且仅支持版本2
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### POOLNFT_SWAP_TO_TOKEN

```ts
const params = [
  {
    flag: "POOLNFT_SWAP_TO_TOKEN",
    nft_contract_address: "",
    address: "",
    tbc_amount: 10,
    poolNFT_version?: 2,
    lpPlan?: 1, //默认值为1
    broadcastEnabled?:true,
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### POOLNFT_SWAP_TO_TBC

```ts
const params = [{
    flag:"POOLNFT_SWAP_TO_TBC",
    nft_contract_address:"",
    address:"",
    ft_amount:10,
    poolNFT_version?: 2,
    lpPlan?:1 //默认值为1,
    broadcastEnabled?:true,
    domain?: "",
}];
const { txid } = await wallet.sendTransaction(params);
//const { txraw } = await wallet.sendTransaction(params);broadcastEnabled为false
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```

### POOLNFT_MERGE

```ts
const params = [
  {
    flag: "POOLNFT_MERGE",
    nft_contract_address: "",
    poolNFT_version?: 2,
    merge_times?: 10, //1-10次 默认为10次 不足10次会提前终止
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);//txid为多个Merge交易的txid之间用逗号隔开
//const { error } = await wallet.sendTransaction(params);广播交易时出现错误
```

### FTLP_MERGE

```ts
const params = [
  {
    flag: "FTLP_MERGE",
    nft_contract_address: "",
    poolNFT_version?: 2,
    lockTime?: 900000, //用于手动设置解锁参数，设置为可解锁的最大高度。若不带此参数情况下若带有锁仓，会自动设置解锁参数为 (当前区块高度 - 2)
    domain?: "",
  },
];
const { txid } = await wallet.sendTransaction(params);//txid为多个Merge交易的txid之间用逗号隔开
//const { error } = await wallet.sendTransaction(params);广播交易时出现错误
```

## sendBatchRequest

批量请求功能支持一次性提交多个独立的请求，每个请求独立执行，一个请求失败不会影响其他请求的执行。

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
