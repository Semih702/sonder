export type AnonymousAuthResponseDto = {
  accessToken: string;
  userId: string;
  displayName: string;
};

export type UserDto = {
  id: string;
  displayName: string;
  isBanned: boolean;
};

