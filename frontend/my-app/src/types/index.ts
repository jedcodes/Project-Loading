export type User = {
  username: string;
  score: number;
  state: object;
};

export type Scenario = {
  id?: number;
  title: string;
  options: string[];
};
