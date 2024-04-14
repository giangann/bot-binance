"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeDelay = void 0;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let num = 0;
    let now = Date.now();
    const interval = setInterval(() => {
        if (num === 5)
            clearInterval(interval);
        else {
            console.log("hello");
            console.log(currNow() - now);
        }
        num = num + 1;
    }, 2000);
});
function currNow() {
    return Date.now();
}
const fakeDelay = (seconds) => __awaiter(void 0, void 0, void 0, function* () {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), seconds * 1000);
    });
    return promise;
});
exports.fakeDelay = fakeDelay;
// main();
