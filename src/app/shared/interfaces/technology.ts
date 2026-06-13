import { Project } from "@shared/interfaces/project";

export interface Technology {
  id?: number;
  name: string;
  position: number;
  projects: Project[]
}
