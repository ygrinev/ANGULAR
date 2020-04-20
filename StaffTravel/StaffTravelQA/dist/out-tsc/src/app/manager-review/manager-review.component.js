"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/toPromise");
var router_1 = require("@angular/router");
var http_client_service_1 = require("../services/http-client/http-client.service");
var request_1 = require("../models/request");
var enums_1 = require("../models/enums");
var resources_service_1 = require("../services/resources/resources.service");
var ManagerReviewComponent = /** @class */ (function () {
    function ManagerReviewComponent(httpClient, router, route, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.router = router;
        this.route = route;
        this.resourcesService = resourcesService;
        this.reviewType = 'manager';
        this.statusEnum = enums_1.StatusEnum;
        this.ancillaryProductEnum = enums_1.AncillaryProductEnum;
        this.transferTypeEnum = enums_1.TransferTypeEnum;
        this.statusArray = [];
        this.typeOfPassArray = new Array();
        this.ancillaryProductsArray = new Array();
        this.transferTypeArray = new Array();
        this.notePaxEmp = "";
        this.notePaxAdmin = "";
        this.noteFlightEmp = "";
        this.noteFlightAdmin = "";
        this.noteHotelEmp = "";
        this.noteHotelAdmin = "";
        this.noteAncEmp = "";
        this.noteAncAdmin = "";
        this.employeeStatus = enums_1.StatusEnum;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.typeOfPassArray = resourcesService.getTypeOfPasses();
            _this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            _this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }
    ManagerReviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            window.scrollTo(0, 0);
            _this.request = new request_1.Request();
            _this.requestId = _this.route.snapshot.params['requestId'];
            if (!_this.requestId) {
                _this.router.navigate(['/home']);
            }
            _this.httpClient.get('api/request/GetManagerReviewRequest?Id=' + params['requestId'])
                .toPromise()
                .then(function (res) {
                _this.request = JSON.parse(res.text());
            })
                .catch(function (e) {
                console.log('error ' + e);
                _this.router.navigate(['/home']);
                return;
            });
        });
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Number)
    ], ManagerReviewComponent.prototype, "selectedEmployee", void 0);
    ManagerReviewComponent = __decorate([
        core_1.Component({
            selector: 'app-manager-review',
            templateUrl: './manager-review.component.html',
            styleUrls: ['./manager-review.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, router_1.Router, router_1.ActivatedRoute, resources_service_1.ResourcesService])
    ], ManagerReviewComponent);
    return ManagerReviewComponent;
}());
exports.ManagerReviewComponent = ManagerReviewComponent;
//# sourceMappingURL=manager-review.component.js.map