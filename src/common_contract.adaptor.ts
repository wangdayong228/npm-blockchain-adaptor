
import { IContractAdaptor } from "./contract.adaptor.interface";
import { CommonHelper } from "./utility/common_helper";

const p = CommonHelper.toPromise;
export class CommonContractAdaptor implements IContractAdaptor {
    [key: string]: any;

    constructor(private contract: any) {
        for (let p in contract) {
            if (!this.hasOwnProperty(p))
                this[p] = contract[p];
        }
    }

    event(name: string, ...params: any[]): {
        watch: (callback: (err, result) => void) => void
    } {
        const event = this.contract[name](...params);
        return event;
    }

    method(name: string): {
        call: (...params) => Promise<any>,
        sendTransaction: (...params) => Promise<any>,
        getData: (...params) => Promise<any>;
    } {
        const c = this.contract[name];
        return {
            call: (...params: any[]) => {
                return CommonHelper.toPromise(c.call.bind(c), ...params);
            },
            sendTransaction: (...params: any[]) => {
                return CommonHelper.toPromise(c.sendTransaction.bind(c), ...params);
            },
            getData: (...params: any[]) => {
                return Promise.resolve(c.getData(...params)); //CommonHelper.toPromise(c.getData.bind(c), ...params);
            }
        };
    }

    async getEvents(event: string, options?: {
        fromBlock?: number,
        toBlock?: number,
        address?: string,
        topics?: string[]
    }): Promise<any[]> {
        // console.log('get all events');

        // const allevents = this.contract.allEvents(options);
        // const logs = await CommonHelper.toPromise(allevents.get.bind(allevents));
        // const events = logs.filter(r => {
        //     return r.event == event
        // });
        // return events;
        var myEvent = this.contract[event](null, options);
        // myEvent.get(function (error, logs) {

        // });
        const logs = await p(myEvent.get.bind(myEvent));
        // console.log(logs);
        return logs;
    }

    async getEventsByTx(event: string, blockNumber: number, txhash: string): Promise<any[]> {
        let events = await this.getEvents(event, { fromBlock: blockNumber, toBlock: blockNumber });
        events = events.filter(r => r.transactionHash === txhash);
        return events;
    }


    // async getEvents(event: string, blockNumber: number, transactionHash: string): Promise<any[]> {
    //     // const tx = await this.getTransaction(transactionHash);
    //     let events = await this.getEvents(event, { fromBlock: blockNumber, toBlock: blockNumber });
    //     events = events.filter(r => r.transactionHash === transactionHash);
    //     return events;
    // }
}