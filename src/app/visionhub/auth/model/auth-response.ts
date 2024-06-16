import { User } from "../../common/model/user";

export interface AuthResponse {
  status: boolean;
  message: string;
  token: string;
  user: User;
}
