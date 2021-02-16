#!/usr/bin/env -S deno test --unstable --import-map=import_map.json
import { assertEquals } from "std/testing/asserts.ts";

import { addDate, createMarkdownList, mergeDates, slimItem } from "./utils.ts";

Deno.test("addDate", () => {
  const item = {
    id: 123,
    score: 217,
    time: 1613144580,
    title: "title",
    url: "url",
  };
  const result = addDate(item);

  assertEquals(result, { ...item, date: "12-02-2021" });
});

Deno.test("mergeDates - items of same day", () => {
  const items = [
    {
      id: 2,
      score: 200,
      time: 1613145581,
      title: "title 2",
      url: "url 2",
      date: "12-02-2021",
    },
    {
      id: 1,
      score: 100,
      time: 1613144580,
      title: "title 1",
      url: "url 1",
      date: "12-02-2021",
    },
  ];
  const merged = mergeDates(items);

  assertEquals(merged, {
    "12-02-2021": {
      id: 2,
      score: 200,
      time: 1613145581,
      title: "title 2",
      url: "url 2",
      date: "12-02-2021",
    },
  });
});

Deno.test("mergeDates - items of different day", () => {
  const items = [
    {
      id: 2,
      score: 200,
      time: 1613145581,
      title: "title 2",
      url: "url 2",
      date: "12-02-2021",
    },
    {
      id: 1,
      score: 100,
      time: 1613144580,
      title: "title 1",
      url: "url 1",
      date: "12-02-2021",
    },
    {
      id: 3,
      score: 100,
      time: 1613431969,
      title: "title 3",
      url: "url 3",
      date: "15-02-2021",
    },
  ];
  const merged = mergeDates(items);

  assertEquals(merged, {
    "12-02-2021": {
      id: 2,
      score: 200,
      time: 1613145581,
      title: "title 2",
      url: "url 2",
      date: "12-02-2021",
    },
    "15-02-2021": {
      id: 3,
      score: 100,
      time: 1613431969,
      title: "title 3",
      url: "url 3",
      date: "15-02-2021",
    },
  });
});

Deno.test("slimItem", () => {
  const item = {
    by: "implying",
    descendants: 714,
    id: 26122924,
    kids: [
      26124135,
      26123271,
      26124019,
      26128365,
      26124298,
      26124720,
      26124041,
      26125297,
      26124200,
      26127756,
    ],
    score: 419,
    time: 1613215053,
    title: "Silicon Valley’s Safe Space",
    type: "story" as const,
    url:
      "https://www.nytimes.com/2021/02/13/technology/slate-star-codex-rationalists.html",
  };
  const result = slimItem(item);

  assertEquals(result, {
    by: "implying",
    descendants: 714,
    id: 26122924,
    score: 419,
    time: 1613215053,
    title: "Silicon Valley’s Safe Space",
    url:
      "https://www.nytimes.com/2021/02/13/technology/slate-star-codex-rationalists.html",
  });
});

Deno.test("createMarkdownList", () => {
  const arr = [
    {
      id: 26138931,
      score: 449,
      time: 1613361739,
      title:
        "SolarWinds hack was 'largest and most sophisticated attack' ever: MSFT president",
      url:
        "https://www.reuters.com/article/us-cyber-solarwinds-microsoft-idUSKBN2AF03R",
      descendants: 261,
      by: "andrewinardeer",
      date: "15-02-2021",
    },
    {
      id: 26128752,
      score: 832,
      time: 1613265359,
      title: "Statement on New York Times Article",
      url:
        "https://astralcodexten.substack.com/p/statement-on-new-york-times-article",
      descendants: 397,
      by: "jger15",
      date: "14-02-2021",
    },
  ];
  const result = createMarkdownList(arr);

  assertEquals(
    result,
    "<!-- BEGIN -->\n    | :coffee: | Title | 💬 |\n    | --- | --- | --- |\n    | 449 | [SolarWinds hack was 'largest and most sophisticated attack' ever: MSFT president](https://www.reuters.com/article/us-cyber-solarwinds-microsoft-idUSKBN2AF03R) | [15-02-2021](https://news.ycombinator.com/item?id=26138931) |\n| 832 | [Statement on New York Times Article](https://astralcodexten.substack.com/p/statement-on-new-york-times-article) | [14-02-2021](https://news.ycombinator.com/item?id=26128752) |\n    <!-- END -->",
  );
});
