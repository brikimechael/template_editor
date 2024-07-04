export type ParameterizedDataType = {
  id: number;
  customerIds: string;
  createdDate: string;
  useCase: string;
  basicat: string;
  adviseStatus : Status;
  criteria: Record<string, string>;
  params: Record<string, string>;
  modelId: string;
  content:string;
  delimiter:string;
}

export enum Status {
  OK,KO,PENDING
  
}