export interface IContractAdaptor {
    [key: string]: any;
    event(name: string, ...params: any[]): {
        watch: (callback: (err, result) => void) => void
    };
    method(name: string): {
        call: (...params) => Promise<any>,
        sendTransaction: (...params) => Promise<any>,
        getData: (...params) => Promise<any>;
    }


    getEvents(event: string, options?: {
        fromBlock?: number,
        toBlock?: number,
        address?: string,
        topics?: string[]
    }): Promise<any[]>;

    getEventsByTx(event: string, blockNumber: number, txhash: string): Promise<any[]>;
    // getEvents(event: string, blockNumber: number, transactionHash: string): Promise<any[]>;
}