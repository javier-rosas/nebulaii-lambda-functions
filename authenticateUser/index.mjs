import jwt from "jsonwebtoken"

export const handler = async(event) => {
    const user = event.body.event;
    return jwt.sign(
      {user}, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h'}, 
      (err, token) => {
      if (err) {
        return {
            statusCode: 400,
            body: JSON.stringify('Unable to authenticate user'),
        }
      } else {
        return {
            statusCode: 200,
            body: JSON.stringify({
              message: 'User Authenticated',
              token
            }),
        }
      }
    })
};