export interface Project {
  id?: number;
  title: string;
  description: string;
  picture?: string;
  deploy?: string;
  github?: string;
  position: number;
  technology: number;
  technology_name?: string;
}
