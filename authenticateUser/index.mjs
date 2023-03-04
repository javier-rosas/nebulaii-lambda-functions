import jwt from "jsonwebtoken";

export const handler = async (event) => {
  const data = JSON.parse(event.body);
  const user = data.event.body.user;
  try {
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User authenticated",
        token,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Unable to authenticate user" }),
    };
  }
};
