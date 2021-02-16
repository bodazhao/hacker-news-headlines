/**
 * from https://github.com/HackerNews/API#items
 */
export type HNItem = {
  id: number;
  deleted?: true;
  type?: "job" | "story" | "comment" | "poll" | "pollopt";
  by?: string;
  time?: number;
  text?: string;
  dead?: true;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
};

/**
 * Only save the info that we need
 * score - determine the highest points
 * descendants - determine the most commented
 */
export type HNItemSlim = Pick<
  HNItem,
  "id" | "score" | "time" | "title" | "url" | "descendants" | "by"
>;

export type HNItemModified = HNItemSlim & { date: string };
