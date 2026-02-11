import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const expiresIn = (process.env.JWT_EXPIRE || '1d') as any;

    return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    const expiresIn = (process.env.JWT_REFRESH_EXPIRE || '7d') as any;

    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): TokenPayload => {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    return jwt.verify(token, secret) as TokenPayload;
};
