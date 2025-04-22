import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '7d'
  });
};

export function verifyToken(token) {
  if (!token) {
    throw new Error('Authentication token is missing');
  }
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    const error = new Error('Invalid or expired authentication token');
    error.statusCode = 401;
    throw error;
  }
}
