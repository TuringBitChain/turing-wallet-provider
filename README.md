# connect

```tsx
npm install turing-wallet-provider@latest

import { TuringProvider } from "turing-wallet-provider";

root.render(
  <TuringProvider>
    <App />
  </TuringProvider>
);
```

```tsx
import { useTuringsWallet } from "turing-wallet-provider";

const wallet = useTuringsWallet();
await wallet.connect();
```

## disconnect

```tsx
const wallet = useTuringsWallet();
await wallet.disconnect();
```

## isConnected

```tsx
const wallet = useTuringsWallet();
const ture/false = await wallet.isConnected();
```

## getPubKey

```tsx
const wallet = useTuringsWallet();
const { tbcPubKey } = await wallet.getPubKey(); //tbcPubKey为string类型
```

## getAddress

```tsx
const wallet = useTuringsWallet();
const { tbcAddress } = await wallet.getAddress(); //tbcAddress为string类型
```

## getBalance

```tsx
const wallet = useTuringsWallet();
const { tbc } = await wallet.getBalance(); //tbc为number类型，单位为tbc
```

## getInfo

```tsx
const wallet = useTuringsWallet();
const {name,platform,version} = await wallet.getInfo();
{Turing,android,1.0.0}示例的返回值
```

## getPaymentUtxos

```tsx
const wallet = useTuringsWallet();
try {
    const utxos = await wallet.getPaymentUtxos();
    console.log(utxos);
} catch (err) {
    console.log(err);
}

[
    {
        satoshis: 205551
        script: "76a914b681d8032b448405d44e82807fab2c8894eed57788ac"
        txid: "c58e8b0dd25e56af0696b026c1961dccd0cab3fe42fb2f3ac934ebdc3accbb40"
        vout: 0
    },
    {
        satoshis: 19909
        script: "76a914b681d8032b448405d44e82807fab2c8894eed57788ac"
        txid: "4c52add57a2c9cda29501a810a1312eaee9423d28440a09acbf5d9d8d0467382"
        vout: 0
    }
]//模拟的输出
```

## signMessage

```tsx
const wallet = useTuringsWallet();
try{
    const { address, pubKey, sig, message } = await wallet.signMessage({ message: "hello world", encoding: "base64" });//encoding可为utf-8,base64,hex
}catch(error){
    console.log(error);
}

//本地验证签名
import * as tbc from "tbc-lib-js"

const msg_buf = Buffer.from(message,encoding);
const true/false = tbc.Message.verify(msg_buf,address,sig);
```

## encrypt

```tsx
const wallet = useTuringsWallet();
try {
  const encryptedMessage = await wallet.encrypt(message);
  if (encryptedMessage) {
    console.log(encryptedMessage);
  }
} catch (error) {
  console.log(error);
}
```

## decrypt

```ts
const wallet = useTuringsWallet();
try {
  const decryptedMessage = await wallet.decrypt(message);
  if (decryptedMessage) {
    console.log(decryptedMessage);
  }
} catch (error) {
  console.log(error);
}
```

## sendTransaction

```tsx
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
    flag: "P2PKH" | "COLLECTION_CREATE" | "NFT_CREATE" | "NFT_TRANSFER" | "FT_MINT" | "FT_TRANSFER" | "POOLNFT_MINT" | "POOLNFT_INIT" | "POOLNFT_LP_INCREASE" |"POOLNFT_LP_CONSUME"| "POOLNFT_SWAP_TO_TOKEN" | "POOLNFT_SWAP_TO_TBC" | "POOLNFT_MERGE"|"FTLP_MERGE";
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
    poolNFT_version?: number; // 1或2 不提供默认为2
    serviceFeeRate?: number; // 0-100 poolNFT_version为2有效 不提供默认为25
    serverProvider_tag?:string; //poolNFT_version为2时为必需字段 poolNFT_version为1无效
    lpPlan?:number //1或2 不提供默认为1 lp手续费方案, 方案1: LP 0.25%  swap服务商 0.09%  协议0.01%; 方案2: LP 0.05%  swap服务商 0.29%  协议0.01%
    domain?:string // 设置构建及广播交易使用的节点和api服务 只支持https 不提供默认值是turingwallet.xyz 具体结构为https://${domain}/v1/tbc/main
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
    domain: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
```

### COLLECTION_CREATE

```ts
const params = [
  {
    flag: "COLLECTION_CREATE",
    collection_data: "",
    domain: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
```

### NFT_CREATE

```ts
const params = [
  {
    flag: "NFT_CREATE",
    nft_data: "",
    collection_id: "",
    domain: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
```

### NFT_TRANSFER

```ts
const params = [
  {
    flag: "NFT_TRANSFER",
    nft_contract_address: "",
    address: "",
    domain: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
```

### FT_MINT

```ts
const params = [
  {
    flag: "FT_MINT",
    ft_data: "",
    domain: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
```

### FT_TRANSFER

```ts
const params = [
  {
    flag: "FT_TRANSFER",
    ft_contract_address: "",
    ft_amount: 0.1,
    tbc_amount: 1, //同时转ft和tbc时候可提供参数
    address: "",
    domain: "",
  },
];
const { txid } = await wallet.sendTransaction(params);
```

### POOLNFT_MINT

```ts
const params = [{
    flag:"POOLNFT_MINT",
    ft_contract_address:"",
    poolNFT_version?：2,
    serverProvider_tag?:"",
    serviceFeeRate?:25, // poolNFT_version为2时此参数有效，默认为25
    with_lock?:false //默认值为false，为true则创建带哈希锁的poolNFT
    lpPlan?:1 //默认值为1
    domain?: "",
}];
const { txid } = await wallet.sendTransaction(params);
```

### POOLNFT_INIT

```ts
const params = [{
    flag:"POOLNFT_INIT",
    nft_contract_address:"",
    address:"",
    tbc_amount:30,
    ft_amount:1000,
    poolNFT_version?：2,
    domain?: "",
}];
const { txid, rawtx } = await wallet.sendTransaction(params);
```

### POOLNFT_LP_INCREASE

```ts
const params = [{
    flag:"POOLNFT_LP_INCREASE",
    nft_contract_address:"",
    address:"",
    tbc_amount:3,
    poolNFT_version?：2,
    domain?: "",
}];
const { txid, rawtx } = await wallet.sendTransaction(params);
```

### POOLNFT_LP_CONSUME

```ts
const params = [{
    flag:"POOLNFT_LP_CONSUME",
    nft_contract_address:"",
    address:"",
    ft_amount:100,
    poolNFT_version?：2,
    domain?: "",
}];
const { txid } = await wallet.sendTransaction(params);
```

### POOLNFT_SWAP_TO_TOKEN

```ts
const params = [{
    flag:"POOLNFT_SWAP_TO_TOKEN",
    nft_contract_address:"",
    address:"",
    tbc_amount:10,
    poolNFT_version?：2
    lpPlan?:1 //默认值为1,
    domain?: "",
}];
const { txid } = await wallet.sendTransaction(params);
```

### POOLNFT_SWAP_TO_TBC

```ts
const params = [{
    flag:"POOLNFT_SWAP_TO_TBC",
    nft_contract_address:"",
    address:"",
    ft_amount:10,
    poolNFT_version?：2
    lpPlan?:1 //默认值为1,
    domain?: "",
}];
const { txid } = await wallet.sendTransaction(params);
```

### POOLNFT_MERGE

```ts
const params = [{
    flag:"POOLNFT_MERGE",
    nft_contract_address:"",
    poolNFT_version?：2,
    merge_times?:1, //1-10次 默认为10次 不足10次会提前终止
    domain?: "",
}];
const { txid } = await wallet.sendTransaction(params);
```

### FTLP_MERGE

```ts
const params = [{
    flag:"FTLP_MERGE",
    nft_contract_address:"",
    poolNFT_version?：2,
    domain?: "",
}];
const { txid } = await wallet.sendTransaction(params);
```
