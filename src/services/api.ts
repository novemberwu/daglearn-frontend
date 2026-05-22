import { Topic, McqDto, ConceptProficiency, AttemptResult } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const apiService = {
  async getTopics(): Promise<Topic[]> {
    const res = await fetch(`${API_BASE_URL}/topics`);
    if (!res.ok) throw new Error("Failed to fetch topics");
    return res.json();
  },

  async getUnlockedTopics(userId: string): Promise<Topic[]> {
    const res = await fetch(`${API_BASE_URL}/topics/unlocked/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch unlocked topics");
    return res.json();
  },

  async getMcqsByTopic(topicId: string): Promise<McqDto[]> {
    const res = await fetch(`${API_BASE_URL}/topics/${topicId}/mcqs`);
    if (!res.ok) throw new Error("Failed to fetch MCQs");
    return res.json();
  },

  async getConceptProficiencies(userId: string): Promise<ConceptProficiency[]> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/proficiencies`);
    if (!res.ok) throw new Error("Failed to fetch proficiencies");
    return res.json();
  },

  async submitAnswer(userId: string, mcqId: string, answer: string): Promise<AttemptResult> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mcqId, answer }),
    });
    if (!res.ok) throw new Error("Failed to submit answer");
    return res.json();
  },
};
