export type EventType = {
  eventInfo: EventInfo
  adviseInfo: AdviseInfo
  notifications: Array<Notification>;
}
export type EventInfo = {
  id: number;
  useCase: string;
  customerIds: string;
  createdDate: Date;
  notificationProcessed: boolean;
  apiIdentifier: string | null;
  basicat: string | null;
  msisdn: string | null;
  idRce: string | null;
}

export type Notification =
{
  status: Status;
  serviceError: string | null;
  serviceKey: string | null;
  serviceName: string;
}

export type AdviseInfo = {
  status: Status;
  error: string | null;
}

export enum Status {
  OK= 'OK',KO='KO',PENDING='PENDING'
}

export type DateRange = [Date, Date]
export type FilterRequest = {
  dateRange:DateRange
  msisdn: string| undefined,
  apiIdentifier: string|undefined,
  useCase : string|undefined,
  recipientEmailAddress: string|undefined,
  adviseStatus: Status | null,
  page: number,
  size: number,
}
