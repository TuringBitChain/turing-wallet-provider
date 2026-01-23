# connect

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
      sig_length + sig + publicKey_length + publicKey.toString()
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
      sig_length + sig + publicKey_length + publicKey.toString()
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
    script?: string;
    satoshis?: number;
    outputIndex: number;
    unfinishedScriptSig: string;//asm 签名使用7369676e6174757265占位
}

interface Output {
    script: string;//asm或hex
    satoshis: number;
}

interface SignAssociatedTransactionRequestData {
	mode?: 'sequential' | 'fromSource';//sequential:连续父子交易,fromSource:使用源头交易的所有输出 默认为sequential
	sourceTxraw: string;
	sourceUtxos: Input[];
	inputs?: Input[][];
	outputs?: Output[][];
	autoChange?: boolean;//默认为true true则子交易最后一个输出由钱包设置为找零输出
}

//p2pkh示例参数
const sourceUtxos: Input[] = [
    {
        txId: "",
        outputIndex: 0,
        satoshis: 1000000000,
        script: tbc.Script.buildPublicKeyHashOut(address).toString(),
        unfinishedScriptSig: `7369676e6174757265 ${publicKey}`,
    }
]

const inputs: Input[][] = [
    [
        { outputIndex: 0, unfinishedScriptSig: `7369676e6174757265 ${publicKey}`},
        { outputIndex: 1, unfinishedScriptSig: `7369676e6174757265 ${publicKey}`},
        {
            txId: "",
            outputIndex: 1,
            satoshis: 1000000000,
            script: tbc.Script.buildPublicKeyHashOut(address).toString(),
            unfinishedScriptSig: `${publicKey}`,
            sigPosition: 0
        }//和父子交易无关的输入
    ],
    [
        { outputIndex: 0, unfinishedScriptSig: `7369676e6174757265 ${publicKey}`},
        { outputIndex: 1, unfinishedScriptSig: `7369676e6174757265 ${publicKey}`}
    ]
];

const outputs: Output[][] = [
    [{ script: tbc.Script.buildPublicKeyHashOut(address).toString(), satoshis: 5000000 }, { script: tbc.Script.buildPublicKeyHashOut(address).toString(), satoshis: 5000000 }]

    , [{ script: tbc.Script.buildPublicKeyHashOut(address).toString(), satoshis: 5000000 }, { script: tbc.Script.buildPublicKeyHashOut(address).toString(), satoshis: 5000000 }]
]

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
    flag: "P2PKH" | "COLLECTION_CREATE" | "NFT_CREATE" | "NFT_TRANSFER" | "FT_MINT" | "FT_TRANSFER" | "POOLNFT_MINT" | "POOLNFT_INIT" | "POOLNFT_LP_INCREASE" |"POOLNFT_LP_CONSUME"| "POOLNFT_LP_BURN" | "POOLNFT_SWAP_TO_TOKEN" | "POOLNFT_SWAP_TO_TBC" | "POOLNFT_MERGE"|"FTLP_MERGE";
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
const { txid } = await wallet.sendTransaction(params);
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
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
const { txid } = await wallet.sendTransaction(params);
//const { error } = await wallet.sendTransaction(params);构建或广播交易时出现错误
```
