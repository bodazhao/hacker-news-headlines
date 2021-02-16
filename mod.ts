#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --unstable --import-map=import_map.json
import { join } from "std/path/mod.ts";

import { HNItem, HNItemModified } from "./types.ts";
import { addDate, createMarkdownList, mergeDates, slimItem } from "./utils.ts";

const DB_FILE = "headlines.json";
const dbPath = join("data", DB_FILE);
const readmePath = "./README.md";
const BEST_STORIES = "https://hacker-news.firebaseio.com/v0/beststories.json";
const getItem = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

async function fetchBestStories(): Promise<number[]> {
  const response = await fetch(BEST_STORIES);

  if (!response.ok) {
    console.error(`Failed to fetch best stories! ${response.statusText}`);
    Deno.exit();
  }

  return response.json();
}

async function fetchAll(items: number[]): Promise<HNItem[]> {
  let all;

  try {
    all = await Promise.all(
      items.map(async (id) => {
        const item = await fetch(getItem(id));
        return item.json();
      }),
    );
  } catch (error) {
    console.error(`Failed to fetch the list of best stories!`);
    Deno.exit();
  }

  return all;
}

async function readDB() {
  const saved = JSON.parse(await Deno.readTextFile(dbPath));
  return Object.values(saved) as HNItemModified[];
}

async function run() {
  console.log("Fetching the latest headlines...");

  // fetch best stories
  const bestStories = await fetchBestStories();
  const downloaded = await fetchAll(bestStories);
  const modified = downloaded.map((x) => slimItem(x)).map((x) => addDate(x));

  // read existing stories, sort by time and merge by date
  const saved = await readDB();
  const all = saved.concat(modified);
  const results = mergeDates(all.sort((a, b) => b.time! - a.time!));
  await Deno.writeTextFile(dbPath, JSON.stringify(results));

  // write to README
  const readme = await Deno.readTextFile(readmePath);
  const markdown = readme.replace(
    /<!-- BEGIN -->[\W\w]*<!-- END -->/,
    createMarkdownList(Object.values(results)),
  );
  await Deno.writeTextFile(readmePath, markdown);

  console.log("Done ~ ~ ~");
}

run();
