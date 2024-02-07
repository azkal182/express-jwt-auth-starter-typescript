import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { loginUserValidation, registerUserValidation } from "../validation/user-validation";
import { validate } from "../validation/validation";
import { hash, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";

const register = async (request: any) => {
    const user = validate(registerUserValidation, request);



    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });
}

const login = async (request: any) => {
    const loginRequest = validate(loginUserValidation, request);
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },

    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const isPasswordValid = compareSync(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }
    // JWT_PRIVATE_KEY.replace(/\\n/gm, '\n')
    // ACCESS_TOKEN_PRIVATE_KEY.replace(/\\n/gm, '\n')
    const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string
    const privateKeyBuffer = Buffer.from(privateKey, 'base64');
    const accessToken = sign({ foo: 'bar' }, privateKeyBuffer, { algorithm: 'RS256' });
    console.log({ privateKey });

    return { user }
}
export default {
    register, login
}
