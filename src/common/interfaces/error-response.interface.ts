export interface ErrorResponse {
  statusCode: number;
  message: string;
  errorCode?: string;
  timestamp: string;
  path: string;
  name: string;
}
