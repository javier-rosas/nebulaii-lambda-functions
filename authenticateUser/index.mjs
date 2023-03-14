import jwt from "jsonwebtoken";

export const handler = async (event) => {
  const user = JSON.parse(event.body);
  try {
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "365d",
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
