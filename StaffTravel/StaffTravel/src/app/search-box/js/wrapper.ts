declare function require(path: string): any;
var initCustomSrc = require("./custom.src.js");
var initGateDestHotelDropsParPays = require("./InitGateDestHotelDropsParPays.js");

function initSearchBox() {
    initCustomSrc();
    initGateDestHotelDropsParPays();
}

export default initSearchBox;