import { IBlockchainAdaptor } from "./blockchain.adaptor.interface";
import Chain3 from 'chain3';
import { CommonBlockchainAdaptorBase } from "./common_blockchain.adaptor";

export class Chain3Adaptor extends CommonBlockchainAdaptorBase {

    constructor(public nodeUrl: string) {
        super(nodeUrl);
        this.core = this.instance.mc;
    }

    initByNodeUrl(): IBlockchainAdaptor {
        if (!this.instance) {
            const provider = new Chain3.providers.HttpProvider(this.nodeUrl);
            this.instance = new Chain3();
            this.instance.setProvider(provider);
        }
        return this.instance;
    }

    sendRawTransation(signedTransactionData: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    signTransaction(rawTx: { [key: string]: any }, privateKey: string): string {
        throw new Error("Method not implemented.");
    }

    createRawTx(from: string, nonce: number, to: string, value: string, data: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    fromWei(amount: number, uint?: string): number {
        throw new Error("Method not implemented.");
    }

}
