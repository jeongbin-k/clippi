import axios from "axios";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export interface HNStory {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

// 상위 스토리 ID 목록 가져오기
export async function getTopStoryIds(): Promise<number[]> {
  const res = await axios.get(`${BASE_URL}/topstories.json`);
  return res.data.slice(0, 20); // 상위 20개만
}

// 개별 스토리 가져오기
export async function getStory(id: number): Promise<HNStory> {
  const res = await axios.get(`${BASE_URL}/item/${id}.json`);
  return res.data;
}

// 상위 20개 스토리 전체 가져오기
export async function getTopStories(): Promise<HNStory[]> {
  const ids = await getTopStoryIds();
  const stories = await Promise.all(ids.map((id) => getStory(id)));
  return stories.filter((s) => s.url); // url 없는 것 제외
}
