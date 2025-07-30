export interface Skills {
  name: string;
  description: string;
  tags: string[];
  execute: (args: string[]) => Promise<any>;
  args: string[];
}
