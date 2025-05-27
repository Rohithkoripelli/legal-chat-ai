export interface DocumentTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: string;
    popularity?: string;
    estimatedTime: string;
    questions: Question[];
    templateContent: string;
    pricing: {
      tier: 'free' | 'basic' | 'premium';
      credits: number;
    };
  }
  
  export interface Question {
    id: string;
    type: 'radio' | 'checkbox' | 'text' | 'number' | 'date';
    title: string;
    description?: string;
    required: boolean;
    options?: QuestionOption[];
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
    };
  }
  
  export interface QuestionOption {
    value: string;
    label: string;
    description?: string;
  }
  
  export interface UserResponses {
    [questionId: string]: string | string[] | number | Date;
  }
  
  export interface GeneratedDocument {
    id: string;
    title: string;
    content: string;
    templateId: string;
    createdAt: Date;
    responses: UserResponses;
  }