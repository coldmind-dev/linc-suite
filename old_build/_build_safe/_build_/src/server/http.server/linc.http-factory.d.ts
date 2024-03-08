interface HttpRequest {
    method?: string;
    url?: string;
    headers: Record<string, string>;
    body?: any;
}
interface HttpResponse {
    statusCode: number;
    setHeader(name: string, value: string): void;
    write(content: string): void;
    end(): void;
}
interface IHttpServer {
    listen(port: number, callback?: () => void): void;
    close(callback?: () => void): void;
}
declare function createServer(): IHttpServer;
export { createServer, IHttpServer, HttpRequest, HttpResponse };
