"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContentfulConfig = /** @class */ (function () {
    function ContentfulConfig(space, accessToken, host, secure, resolveLinks, agent, locale) {
        this.space = space;
        this.accessToken = accessToken;
        this.secure = secure;
        this.host = host || "";
        this.resolveLinks = resolveLinks || true;
        this.agent = agent || "";
        this.locale = locale || "";
    }
    ContentfulConfig.prototype.getConfigObject = function () {
        return {
            space: this.space,
            accessToken: this.accessToken,
            secure: this.secure,
            host: this.host,
            resolveLinks: this.resolveLinks,
            agent: this.agent,
            locale: this.locale
        };
    };
    return ContentfulConfig;
}());
exports.ContentfulConfig = ContentfulConfig;
//# sourceMappingURL=contentful-config.js.map