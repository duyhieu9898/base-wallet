interface Web3Window extends Window {
    readonly web3: any;
    readonly ethereum: any;
    readonly BinanceChain?: any;
}

const web3Window = window as Web3Window;
export { web3Window };
