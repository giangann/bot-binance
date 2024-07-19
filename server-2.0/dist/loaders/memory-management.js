"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetData = void 0;
const resetData = () => {
    global.orderPieces = [];
    global.orderPiecesMap = {};
    global.positionsMap = {};
    global.orderInfosMap = {};
};
exports.resetData = resetData;
