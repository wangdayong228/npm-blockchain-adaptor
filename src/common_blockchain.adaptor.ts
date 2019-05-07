import { IBlockchainAdaptor } from "./blockchain.adaptor.interface";
import { CommonContractAdaptor } from "./common_contract.adaptor";
import { IContractAdaptor } from "./contract.adaptor.interface";
import { EventEmitter } from "events";
import { CommonHelper } from "./utility/common_helper";

export abstract class CommonBlockchainAdaptorBase extends EventEmitter implements IBlockchainAdaptor {

    [key: string]: any;
    instance: any;
    toBigNumber: Function;
    //chain3.mc | web3.eth
    core: any;
    // protected eventEmitter: EventEmitter;

    constructor(public nodeUrl: string) {
        super();
        this.initByNodeUrl();
        this.listenConnection();
        this.toBigNumber = this.instance.toBigNumber;
        for (let prop in this.instance) {
            if (!this.hasOwnProperty(prop))
                this[prop] = this.instance[prop];
        }
    }

    abstract initByNodeUrl();
    abstract sendRawTransation(signedTransactionData: string): Promise<string>;
    abstract signTransaction(rawTx: any, privateKey: string): string;
    abstract createRawTx(from: string, nonce: number, to: string, value: string, data: string): Promise<any>;
    abstract fromWei(amount: number, uint?: string): number;

    listenConnection(): void {
        let lastState = false;
        setInterval(() => {
            const currentState = this.instance.isConnected();
            // console.log('node connection', currentState);
            if (lastState !== currentState) {
                this.emit('connectionChanged', currentState);
            }
            lastState = currentState;
        }, 1000);
    }

    unlockAccount(address: string, password: string) {
        this.instance.personal.unlockAccount(address, password);
    }

    getContract(abi: any, contractAddress: string): IContractAdaptor {
        const contract = this.core.contract(abi).at(contractAddress);
        return new CommonContractAdaptor(contract);
    }

    async getNonce(address: string, pendingCount = 0): Promise<number> {
        let txnsCount = await CommonHelper.toPromise(this.core.getTransactionCount.bind(this.core), address);
        return txnsCount + pendingCount;
        // const res = await CommonHelper.toPromise(this.instance.currentProvider.sendAsync.bind(this.instance.currentProvider), {
        //     method: "txpool_content",
        //     params: [],
        //     jsonrpc: "2.0",
        //     id: new Date().getTime()
        // });
        // console.log(res);
        // if (res.result.pending) {
        //     if (res.result.pending[address]) {
        //         txnsCount = txnsCount +
        //             Object.keys(res.result.pending[address]).length;
        //         return txnsCount;
        //     } else
        //         return txnsCount;
        // } else
        //     return txnsCount;
    }

    async getGasPrice(): Promise<string> {
        let gasPrice = await CommonHelper.toPromise(this.core.getGasPrice.bind(this.instance));
        gasPrice = Math.max(gasPrice, 3e9);
        return gasPrice.toString(16);
    }

    async estimateGas(to: string, data: string): Promise<number> {
        const gas = await CommonHelper.toPromise(this.core.estimateGas, {
            to: to,
            data: data
        });
        return gas;
    }

    async getBlockNumber(): Promise<number> {
        return CommonHelper.toPromise(this.core.getBlockNumber);
    }

    getBlock(blockHashOrBlockNumber, returnTransactionObjects = false): {
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
    } {
        // const block = await CommonHelper.toPromise(this.core.getBlock, blockHashOrBlockNumber, returnTransactionObjects);
        const block = this.core.getBlock(blockHashOrBlockNumber, returnTransactionObjects);
        block.totalDifficulty = block.totalDifficulty.toString();
        block.difficulty = block.difficulty.toString();
        return block;
    }

    async getTransaction(txHash: string): Promise<{
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
    }> {
        return this.loopRequestWithCallback(this.core.getTransaction.bind(this.core), 300, 2000, txHash);
    }

    async getTransactionReceipt(txHash: string): Promise<{
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
    }> {
        return this.loopRequestWithCallback(this.core.getTransactionReceipt.bind(this.core), 30000, 10000, txHash);
    }

    loopRequestWithCallback(method: Function, maxCount: number, intervalInMs: number, ...args: any[]): Promise<any> {
        let runCount = 0;
        return new Promise((rsl, rjc) => {
            const run = () => {
                // console.log(runCount);
                method(...args, (err: any, result: any) => {
                    if (!err && result)
                        rsl(result);
                    else if (runCount++ >= maxCount)
                        rjc(err ? err : `${method} timeout error`);
                    else
                        setTimeout(run, intervalInMs);
                })
            };
            run();
        });
    }

}
