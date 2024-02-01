export type SprintTask = {
  id: number;
  title: string;
  type: "story" | "bug";
};

export type SprintStatus = {
  id: number;
  name: string;
  tasks: SprintTask[];
};
