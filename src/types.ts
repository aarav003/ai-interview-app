
export enum InterviewStatus {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
  ERROR,
}

export interface InterviewTurn {
  speaker: 'user' | 'ai';
  text: string;
}