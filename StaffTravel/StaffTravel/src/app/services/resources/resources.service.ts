import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { TypeOfPassEnum, TransferTypeEnum, AncillaryProductEnum, StatusEnum } from '../../models/enums';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

@Injectable()
export class ResourcesService {
    public resourcesAPI: string = 'api/Resource/GetResourceStringsFromResources?culture={0}'
    public resources: ConnectableObservable<Object>;
    public cultrue: string;
    public r: any = {};


    constructor(private http: Http) {
        if (this.getCookie("culture"))
            this.cultrue = this.getCookie("culture");
        else {
            this.setCookie('culture', 'en-CA', 365);
            this.cultrue = 'en-CA';
        }
        this.resources = this.getResources();
        this.resources.subscribe(res => this.r = res);
    }

    public getResources(): ConnectableObservable<Object> {

        if (!this.resources) {
            let connectableObs = this.http.get(this.resourcesAPI.replace('{0}', this.cultrue))
                .map(res => res.json())
                .publishReplay();

            connectableObs.connect();
            
            return connectableObs;
        }
        else
            return this.resources;

    }

    public getLanguage(): string {
        return this.cultrue.substr(0, 2);
    }

    setCookie(cname: String, cvalue: string, exdays: number) {
        if (exdays > 0) {
            let d: Date = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires: string = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        else {
            document.cookie = cname + "=" + cvalue + ";" + ";path=/";
        }
    }

    getCookie(cname: string) {
        let name: string = cname + "=";
        let ca: string[] = decodeURIComponent(document.cookie).split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    deleteCookie(cname: string) {
        let d: Date = new Date(0);
        let expires: string = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + '' + ";" + expires + ";path=/";
    }

    deleteAllCookies() {
        let ca: string[] = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            this.deleteCookie(c.split('=')[0]);
        }
    }

    getTypeOfPasses() {
        return [
            //{ value: TypeOfPassEnum.YCP, name: this.r['typeOfPassDesc' + TypeOfPassEnum.YCP] },
            //{ value: TypeOfPassEnum.BCP, name: this.r['typeOfPassDesc' + TypeOfPassEnum.BCP] },
            { value: TypeOfPassEnum.LMCP, name: this.r['typeOfPassDesc' + TypeOfPassEnum.LMCP] },
            { value: TypeOfPassEnum.NONE, name: this.r['typeOfPassDesc' + TypeOfPassEnum.NONE] },
            { value: TypeOfPassEnum.IP, name: this.r['typeOfPassDesc' + TypeOfPassEnum.IP] },
        ];
    }

    getAncillaryProducts() {
        return [
            { value: AncillaryProductEnum.Excursion, name: this.r['ancillaryProductDesc' + AncillaryProductEnum.Excursion] },
            { value: AncillaryProductEnum.Transfer, name: this.r['ancillaryProductDesc' + AncillaryProductEnum.Transfer] },
            { value: AncillaryProductEnum.Insurance, name: this.r['ancillaryProductDesc' + AncillaryProductEnum.Insurance] },
            { value: AncillaryProductEnum.CarRental, name: this.r['ancillaryProductDesc' + AncillaryProductEnum.CarRental] }
        ];
    }

    getTransferTypes() {
        return [
            { value: TransferTypeEnum.Shared, name: this.r['transferTypeDesc' + TransferTypeEnum.Shared] },
            { value: TransferTypeEnum.Private, name: this.r['transferTypeDesc' + TransferTypeEnum.Private] }
        ];
    }

    getStatusesArray(){
        return new Array<number>(StatusEnum.Pending, StatusEnum.Approved, StatusEnum.Denied);
    }

    public getErrorMessage(errCode: string): string {
        switch (errCode) {
            case "ERR-REG-001":
                return this.r.ERR_REG_001;
            case "ERR-REG-002":
                return this.r.ERR_REG_002;
            case "ERR-REG-003":
                return this.r.ERR_REG_003;
            case "ERR-REG-004":
                return this.r.ERR_REG_004;
            case "ERR-REG-005":
                return this.r.ERR_REG_005;
            case "ERR-REG-006":
                return this.r.ERR_REG_006;
            case "ERR-REG-007":
                return this.r.ERR_REG_007;
            case "ERR-REG-008":
                return this.r.ERR_REG_008;
            case "ERR-REG-009":
                return this.r.ERR_REG_009;
            case "ERR-LOG-001":
                return this.r.ERR_LOG_001;
            case "ERR-LOG-002":
                return this.r.ERR_LOG_002;
            default:
                return this.r.unknownError;
        }

    }
}
