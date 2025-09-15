export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface IEmailCheckResult<T> {
    success : boolean;
    data : T | null
}
export interface IDecoded {
    _id: string ; email : string ; refreshToken : string
}