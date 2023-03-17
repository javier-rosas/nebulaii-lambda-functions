import middy from "middy";
import { verifyTokenMiddleware } from "./auth/verifyTokenMiddleware.mjs";
import { mongooseConnect } from "./mongoose/mongooseConnect.mjs"
import UserDao from "./daos/UserDao.mjs"

const jwtSecret = process.env.JWT_SECRET;

/**
The main handler function.
* @param {Object} event - The event object.
* @param {string} event.body - The user object.
* @returns {Object} An object containing the status
**/
const myHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const userJwtDecoded = event.user;
    const user = JSON.parse(event.body);

    if (userJwtDecoded.email !== user.email) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Decoded user email and user email in body don't match" })
      }
    }
    await mongooseConnect()
    const userDao = new UserDao();
    const newUser = await userDao.createOrUpdateUser(user)
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch(error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

// export handler with middleware
export const handler = middy(myHandler).use(
  verifyTokenMiddleware({ secret: jwtSecret })
);
