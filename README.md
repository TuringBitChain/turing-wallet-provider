# Turing Wallet Provider 

## Description

The Turing Wallet Provider simplifies the process of integrating Turing Wallet into your react application by creating a provider that wraps your application.

## Installation

Install the package using npm:

```sh
npm install turing-wallet-provider
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


