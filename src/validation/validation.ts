import { ResponseError } from "../error/response-error";

const validate = (schema: any, request: any) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    throw result.error;
  } else {
    return result.value;
  }
};

export { validate };
