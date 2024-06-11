export class ThreeDModel {
  id: number;
  user_id: number;
  name?: string;
  description?: string;
  prompt: string;
  path: string;
  created_at: string;
  updated_at: string;

  constructor(data: any) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data?.name;
    this.description = data?.description;
    this.prompt = data.positivePrompt;
    this.path = data.path;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
