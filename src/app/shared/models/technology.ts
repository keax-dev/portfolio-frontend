import { Project } from "./project";

export interface Technology {
  id?: number;
  name: string;
  position: number;
  projects: Project[]
}
