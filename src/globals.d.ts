// global.d.ts

type TRequestMethods = "eth_requestAccounts" | "wallet_switchEthereumChain" | "wallet_addEthereumChain";

interface IRequestParams {
    method: TRequestMethods;
}
interface IEthereum {
    isTrust: boolean;
    providers: any[];
    request: (params: IRequestParams) => Promise<any>;
}

interface TrustWalletEventMap {
    "trustwallet#initialized": CustomEvent;
}

interface WindowEventMap extends TrustWalletEventMap {}

interface Window {
    ethereum: IEthereum | undefined;

    trustwallet: any;

    addEventListener<K extends keyof WindowEventMap>(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener<K extends keyof WindowEventMap>(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
}