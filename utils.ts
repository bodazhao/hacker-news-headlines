import { format } from "std/datetime/mod.ts";

import { HNItem, HNItemModified, HNItemSlim } from "./types.ts";

export function slimItem(item: HNItem): HNItemSlim {
  const { id, score, time, title, url, descendants, by } = item;
  return { id, score, time, title, url, descendants, by };
}

export function addDate(obj: HNItemSlim): HNItemModified {
  return { ...obj, date: format(new Date(obj.time! * 1000), "dd-MM-yyyy") };
}

/**
 * merge items with the same date and keep the one with the highest score
 */
export function mergeDates(items: HNItemModified[]) {
  return items.reduce((acc: { [date: string]: HNItemModified }, curr) => {
    // first time the accumulator initalising the specified date
    if (!acc.hasOwnProperty(curr.date)) {
      return { ...acc, [curr.date]: curr };
    }

    // else only save the date value with the highest score value
    return {
      ...acc,
      [curr.date]: curr.score! > acc[curr.date].score! ? curr : acc[curr.date],
    };
  }, {});
}

export function createMarkdownList(items: HNItemModified[]) {
  const comments = (id: number) => `https://news.ycombinator.com/item?id=${id}`;
  const arr = items.map((x) => {
    // if items.url doesn't exist (like an Ask HN story), use items.id instead
    return !x.hasOwnProperty("url") ? { ...x, url: comments(x.id) } : x;
  });
  const list = arr.map((x) =>
    `| ${x.score} | [${x.title}](${x.url}) | [${x.date}](${comments(x.id)}) |`
  ).join("\n");

  return `
<!-- BEGIN -->
| :coffee: | Title | 💬 |
| --- | --- | --- |
${list}
<!-- END -->`;
}
