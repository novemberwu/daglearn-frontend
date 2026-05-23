import { Topic, McqDto, ConceptProficiency, AttemptResult } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  async getTopics(token?: string): Promise<Topic[]> {
    const res = await fetch(`${API_BASE_URL}/topics`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch topics");
    return res.json();
  },

  async getUnlockedTopics(userId: string, token?: string): Promise<Topic[]> {
    const res = await fetch(`${API_BASE_URL}/topics/unlocked/${userId}`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch unlocked topics");
    return res.json();
  },

  async getMcqsByTopic(topicId: string, token?: string): Promise<McqDto[]> {
    const res = await fetch(`${API_BASE_URL}/topics/${topicId}/mcqs`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch MCQs");
    return res.json();
  },

  async getConceptProficiencies(userId: string, token?: string): Promise<ConceptProficiency[]> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/proficiencies`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch proficiencies");
    return res.json();
  },

  async submitAnswer(userId: string, mcqId: string, answer: string, token?: string): Promise<AttemptResult> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/attempts`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ mcqId, answer }),
    });
    if (!res.ok) throw new Error("Failed to submit answer");
    return res.json();
  },
};
