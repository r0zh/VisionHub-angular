export class User {
  id: number;
  role_id: number[];
  name: string;
  bio?: string;
  profilePic?: string;
  email: string;

  constructor(data: any = {}) {
    this.id = data.id;
    this.role_id = data.role_id;
    this.email = data?.email;
    this.name = data?.name;
    this.bio = data?.bio;
    this.profilePic = data?.profilePic;
  }
}
