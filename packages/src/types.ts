export interface TimelineItem {
  date?: string;
  displayName?: string;
  content?: string;
  image?: string;
  active?: boolean;
  relatedLinks?: string;
}

export interface TimelineApiResponse {
  items: Array<{
    spec?: {
      date?: string;
      displayName?: string;
      content?: string;
      image?: string;
      active?: boolean;
      relatedLinks?: string;
    };
  }>;
  total?: number;
  page?: number;
  size?: number;
}

