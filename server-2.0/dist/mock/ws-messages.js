"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListMessages = void 0;
const gen_message_1 = require("./gen-message");
const symbol_ticker_price_ws_1 = require("./symbol-ticker-price-ws");
const createListMessages = () => {
    const message1 = symbol_ticker_price_ws_1.mockWebSocketMessage1;
    const message2 = (0, gen_message_1.genMessageWs)(message1);
    const message3 = (0, gen_message_1.genMessageWs)(message2);
    const message4 = (0, gen_message_1.genMessageWs)(message3);
    const message5 = (0, gen_message_1.genMessageWs)(message4);
    const message6 = (0, gen_message_1.genMessageWs)(message5);
    const message7 = (0, gen_message_1.genMessageWs)(message6);
    const message8 = (0, gen_message_1.genMessageWs)(message7);
    const message9 = (0, gen_message_1.genMessageWs)(message8);
    const message10 = (0, gen_message_1.genMessageWs)(message9);
    const listMessage = [
        message1,
        message2,
        message3,
        message4,
        message5,
        message6,
        message7,
        message8,
        message9,
        message10,
    ];
    return listMessage;
};
exports.createListMessages = createListMessages;
