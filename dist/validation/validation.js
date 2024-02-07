"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    });
    if (result.error) {
        throw result.error;
    }
    else {
        return result.value;
    }
};
exports.validate = validate;
