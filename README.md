# Turing Wallet Provider 

## Description

The Turing Wallet Provider simplifies the process of integrating [Turing Wallet](https://chromewebstore.google.com/detail/turing-wallet/hmodlkcjggjgfalgdgbflhefijojdjen?hl=zh-CN&utm_source=ext_sidebar) into your react application by creating a provider that wraps your application.

## Installation

Install the package using npm/yarn:

```sh
npm install turing-wallet-provider
yarn add turing-wallet-provider
```

## Usage

### Setup the Provider

First, wrap your application with the TuringProvider.

```tsx
//... other imports
import { TuringProvider } from "turing-wallet-provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <TuringProvider>
    <App />
  </TuringProvider>
);
```

### Use the Wallet Hook

You can now use the useTuringWallet hook to interact with the wallet.

```tsx
import { useTuringWallet } from 'turing-wallet-provider';

function YourComponent() {
  const wallet = useTuringWallet();
  const isReady = wallet.isReady;
  console.log(isReady);
  // true

  return (
    // Your TSX
  );
}
```

### Provider Api

#####  GettingAdresses & Public Keys

After establishing a connection, you'll likely need to know the user's addresses and public keys at some point.

```tsx
const { tbcAddress, ordAddress, identityAddress } = await wallet.getAddresses();
const { tbcPubKey, ordPubKey, identityPubKey } = await wallet.getPubKeys();
```

##### Send TBC

Before send TBC to a Bitcoin address(es), you may simply pass an `array` of payment objects.

```tsx
const paymentParams: = [
  {
    satoshis: 10000,
    address: "18izL7Wtm2fx3ALoRY3MkY2VFSMjArP62D",
  },
  {
    satoshis: 54000,
    address: "1q6td54oZU8EPM1PwJcB1Z6upPyMe3Vy2",
  },
];
const { txid, rawtx } = await wallet.sendTbc(paymentParams);
```

##### Get UTXOs

```tsx
const utxos = await wallet.getPaymentUtxos();
```

##### Get Social Profile

After establishing a connection, your application may want to pull in certain social preferences like a user Display Name or Avatar.

```tsx
const { displayName, avatar } = await wallet.getSocialProfile();
```

##### Get Balance

```tsx
const { tbc, satoshis, usdInCents } = await wallet.getBalance();
```

##### Get Exchange Rate

Fetch the TBC exchange rate in USD.

```tsx
const rate = await wallet.getExchangeRate();
```

##### Disconnect the Provider

Turing Wallet will whitelist the requesting applications domain. To sever this connection you can simply call `disconnect()`. 

```tsx
await wallet.disconnect()
```

##### Broadcast Raw Tx

You will need to pass an object that contains the rawtx:

```tsx
{
    rawtx: string
    fund?: boolean;
}
```

Passing the optional fund param will add and sign inputs from the user's Turing Wallet along with calculating and applying the appropriate change for the tx.

```tsx
const param = {
  rawtx:"xxx",
};
const txid = await wallet.broadcast(param);
```

##### Sign Message

To transmit a message for user signing you must pass an object that contains a message. You can also pass an optional encoding param for more advanced signings:

```tsx
{
  message: string;
  encoding?: "utf8" | "hex" | "base64" ;
};
const message = { message: "Hello world" };
const response = await panda.signMessage(message);
```

##### Get Signatures

```tsx
  const sigRequests: SignatureRequest[] = [
  { 
    prevTxid: 
    outputIndex: 0,
    inputIndex: 0,
    satoshis: 1,
    address: 
  },
  { 
    prevTxid: 
    outputIndex: 0,
    inputIndex: 1,
    satoshis: 1000,
    address: 
    script: 
  }
];

const sigResponses: SignatureResponse[] = await wallet.getSignatures({
  rawtx: 
  sigRequests
});
```

# Demo

[turing-wallet-sample](https://github.com/TuringBitChain/turing-wallet-sample)
