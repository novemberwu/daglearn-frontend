export interface Topic {
  id: string;
  title: string;
  description: string;
  requiredProficiencyScore: number;
  prerequisites: Topic[];
}

export interface McqDto {
  id: string;
  content: string;
  options: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ConceptProficiency {
  conceptId: string;
  conceptName: string;
  percentage: number;
}

export interface AttemptResult {
  correct: boolean;
  conceptId: string;
  newProficiencyPercentage: number;
}
