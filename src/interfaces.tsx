export interface Chats {
  text: string;
  speaker: string;
}

export interface ChatWindowInterface {
  title: string;
  botIcon?: string;
  serverURL?: string;
  session_id: string;
  chats: Chats[];
  updateChats: any;
  width?: number;
  height?: number;
  handleInput?: Function;
}

export interface BotConfig {
  title: string;
  description: string;
  embedCode: string;
  developmentPlatform: string;
  botName: string;
  botIntro: string;
  botIcon: string;
  serverURL: string;
  consentNote: string;
  enableBugReport: string;
  enableFeedback: string;
  feedbackLink: string;
  displayContent: string;
}
