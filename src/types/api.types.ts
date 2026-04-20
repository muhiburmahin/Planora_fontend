export interface IMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface ApiResponse<TData> {
    success: boolean;
    message: string;
    meta?: IMeta;
    data: TData;
    errorSources?: Array<{ path: string; message: string }>;
}