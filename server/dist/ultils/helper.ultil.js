"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDate = exports.priceToPercent = void 0;
function priceToPercent(p1, p2) {
    console.log("prev", p1, "curr", p2);
    if (p1 < p2)
        return (p2 / p1 - 1) * 100;
    else
        return -(p1 / p2 - 1) * 100;
}
exports.priceToPercent = priceToPercent;
function compareDate(date1, date2) {
    if (date1 >= date2)
        return -1;
    else
        return 1;
}
exports.compareDate = compareDate;
