"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerResponse = void 0;
class ServerResponse {
    static error(res, errorMessage, status = 400) {
        res.status(status);
        res.json({
            success: false,
            error: { name: "Backend Error", message: errorMessage },
        });
    }
    static response(res, data, status = 200, cookie, total) {
        let meta = { total };
        res.status(status);
        if (cookie) {
            const { key, value } = cookie;
            res.cookie(key, value);
        }
        res.json({ data, meta, success: true });
    }
}
exports.ServerResponse = ServerResponse;
