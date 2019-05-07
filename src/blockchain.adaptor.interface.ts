import { IContractAdaptor } from "./contract.adaptor.interface";

export interface IBlockchainAdaptor {
    [key: string]: any;
    instance: any;
    toBigNumber: Function;
    //chain3.mc | web3.eth
    core: any;

    initByNodeUrl(url: string);
    unlockAccount(address: string, password: string);
    getContract(abi: any, contractAddress: string): IContractAdaptor;

    createRawTx(from: string, nonce: number, to: string, value: string, data: string): Promise<any>;
    sendRawTransation(signedTransactionData: string): Promise<string>;
    signTransaction(rawTx: any, privateKey: string): string;

    getNonce(address: string, pendingCount?: number): Promise<number>;
    getGasPrice(): Promise<string>;
    estimateGas(to: string, data: string): Promise<number>;
    getBlockNumber(): Promise<number>;
    fromWei(amount: number, uint?: string): number;
    getBlock(blockHashOrBlockNumber, returnTransactionObjects?: boolean): {
        Number: number,
        hash: string,
        parentHash: string,
        nonce: string,
        sha3Uncles: string,
        logsBloom: string,
        tratransactionsRoot: string,
        stateRoot: string,
        miner: string,
        difficulty: string,
        totalDifficulty: string,
        extraData: string,
        size: number,
        gasLimit: number,
        gasUsed: number,
        timestamp: number,
        transactions: any[],
        uncles: string[]
    };

    getTransaction(txHash: string): Promise<{
        hash: string,
        nonce: number,
        blockHash: string,
        blockNumber: number,
        transactionIndex: number,
        from: string,
        to: string,
        value: string,
        gasPrice: string,
        gas: number,
        input: string
    }>;

    getTransactionReceipt(txHash: string): Promise<{
        blockHash: string,
        blockNumber: number,
        transactionHash: string,
        transactionIndex: number,
        from: string,
        to: string,
        cumulativeGasUsed: number,
        gasUsed: number,
        contractAddress: string,
        status: string,
        logs: any[]
    }>;
}

