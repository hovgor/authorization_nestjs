export interface JwtPayloadUserData {
  sub: number;
}

export interface JwtPayload extends JwtPayloadUserData {
  iat: number;
  exp: number;
}
