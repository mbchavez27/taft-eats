export type CreateUserDTO = {
  username: string;
  name: string;
  email: string;
  password: string; //unhashed
  bio?: string;
  role?: "user" | "owner" | "admin"; //default is user
  profile_picture_url?: string;
};

export type UpdateUserDTO = {
  username?: string;
  name?: string;
  email?: string;
  bio?: string;
  profile_picture_url?: string;
};

export type UpdateUserRoleDTO = {
  role: "user" | "owner" | "admin";
};

export type UserResponseDTO = {
  user_id: number;
  username: string;
  name: string;
  email: string;
  bio: string | null;
  role: "user" | "owner" | "admin";
  profile_picture_url: string | null;
  created_at: Date;
};

export type LoginDTO = {
  email: string;
  password: string;
};
