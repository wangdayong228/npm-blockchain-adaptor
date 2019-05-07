
import * as fs from 'fs';
// const Chain3 = require('chain3');
export class CommonHelper {

    // chain3: any;
    diceContract: any;
    // logPath: string;
    static readonly ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

    config = {
        moacNodeUrlForTp: "http://10.10.10.122:8545",
        contractAddress: "0xcfb32896c2dcc5ae040c195033858dbe6d8f05b2",
        logPathPrefix: "log",
    };

    constructor(config?: {
        moacNodeUrlForTp: string,
        contractAddress: string,
        logPathPrefix: string;
    }) {
        // this.logPath = `./log/${this.config.logPathPrefix}_${Date.now().toString().replace('/', '_')}.csv`;
    }

    // async appendLog(...data: any[]) {
    //     return CommonHelper.appendFile(this.logPath, ...data);
    // }

    static isNull(input: string | number): boolean {
        return input === null || input === undefined || input === '0x0';
    }

    static isNotNull(input: string | number): boolean {
        return !CommonHelper.isNull(input);
    }

    static toPromise(func: any, ...args: any[]): Promise<any> {
        return new Promise((rsl, rjc) => {
            func(...args, (err: any, result: any) => {
                // this.appendlog(...args, err, result);
                if (err)
                    rjc(err);
                else
                    rsl(result);
            });
        });
    }

    static async appendFile(fileName: string, ...data: any[]) {
        const now = new Date().toLocaleString().
            replace(/T/, ' ');      // replace T with a space
        // replace(/\..+/, '');     // delete the dot and everything after
        const str = data.map(d => d && d.toString()).join(' ');
        console.log(str);
        // this.appendFile(fileName, str);
        return CommonHelper.toPromise(fs.appendFile, fileName, now + '\t ' + str + '\n');
    }

}