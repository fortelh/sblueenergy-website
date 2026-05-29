import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './auth';

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const token = extractTokenFromHeader(req.headers.get('Authorization') || '');

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(req);
  };
}
