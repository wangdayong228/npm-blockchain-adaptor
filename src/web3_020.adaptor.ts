import Web3 from 'web3';
import { CommonBlockchainAdaptorBase } from "./common_blockchain.adaptor";
import Tx from 'ethereumjs-tx';
import { CommonHelper } from "./utility/common_helper";


export class Web3_020Adaptor extends CommonBlockchainAdaptorBase {

    constructor(public nodeUrl: string) {
        super(nodeUrl);
        this.core = this.instance.eth;
    }

    initByNodeUrl() {
        if (!this.instance) {
            const provider = new Web3.providers.HttpProvider(this.nodeUrl);
            this.instance = new Web3();
            this.instance.setProvider(provider);
        }
        return this.instance;
    }

    async createRawTx(from: string, nonce: number, to: string, value: string, data: string): Promise<any> {
        const gasLimit = 5000000;//  await this.estimateGas(to, data);//
        const rawTx = {
            nonce: nonce, // await this.getNonce(from),
            gasPrice: '0x' + await this.getGasPrice(),
            gasLimit: '0x' + gasLimit.toString(16),
            to: to,
            value: value,
            data: data
        };
        return rawTx;
    }

    sendRawTransation(signedTransactionData: string): Promise<string> {
        return CommonHelper.toPromise(this.core.sendRawTransaction, '0x' + signedTransactionData);
    }

    signTransaction(rawTx: any, privateKey: string): string {
        const tx = new Tx(rawTx);
        const buffer = new Buffer(privateKey.substr(2), 'hex');
        tx.sign(buffer);
        const serializedTx = tx.serialize();
        return serializedTx.toString('hex');
    }

    fromWei(amount: number, uint = 'ether') {
        return this.instance.fromWei(amount, uint)
    }
}