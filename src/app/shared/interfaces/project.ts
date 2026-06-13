export interface Project {
  id?: number;
  title: string;
  title_es: string;
  description: string;
  description_es: string;
  picture?: string;
  deploy?: string;
  github?: string;
  position: number;
  technology: number;
  technology_name?: string;
}
