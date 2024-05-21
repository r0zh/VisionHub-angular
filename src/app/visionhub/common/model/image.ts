export class Image {
  id: number;
  user_id: number;
  style_id?: number;
  name?: string;
  description?: string;
  positivePrompt: string;
  negativePrompt?: string;
  seed: number;
  path: string;
  created_at: string;
  updated_at: string;

  constructor(data: any) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.style_id = data?.style_id;
    this.name = data?.name;
    this.description = data?.description;
    this.positivePrompt = data.positivePrompt;
    this.negativePrompt = data?.negativePrompt;
    this.seed = data.seed;
    this.path = data.path;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
