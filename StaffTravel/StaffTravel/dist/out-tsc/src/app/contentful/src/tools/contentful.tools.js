"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transformResponse(response) {
    // collect all includes
    var includes = {};
    for (var key in response.includes) {
        if (response.includes.hasOwnProperty(key)) {
            for (var _i = 0, _a = response.includes[key]; _i < _a.length; _i++) {
                var item = _a[_i];
                includes[item.sys.id] = item;
            }
        }
    }
    for (var _b = 0, _c = response.items; _b < _c.length; _b++) {
        var item = _c[_b];
        includes[item.sys.id] = item;
    }
    //  will change it later
    for (var _d = 0, _e = response.items; _d < _e.length; _d++) {
        var item = _e[_d];
        for (var key in item.fields) {
            if (item.fields.hasOwnProperty(key)) {
                var value = item.fields[key];
                if (value instanceof Array) {
                    extendsArrayWithFields(value);
                }
                if (value instanceof Object && value.hasOwnProperty('sys')) {
                    extendsObjectWithFields(value);
                }
            }
        }
    }
    function extendsObjectWithFields(value) {
        if (value.hasOwnProperty('sys') && includes.hasOwnProperty(value.sys.id)) {
            value.fields = includes[value.sys.id].fields;
            value.sys = includes[value.sys.id].sys;
        }
    }
    function extendsArrayWithFields(items) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            extendsObjectWithFields(item);
        }
    }
    return response.items;
}
exports.transformResponse = transformResponse;
//# sourceMappingURL=contentful.tools.js.map