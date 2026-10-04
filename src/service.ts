// ============================================================================
// CHALLENGE 3: ASYNC/AWAIT, PROMISES & ERROR HANDLING
//
// Rules:
// 1. Define RemoteOrder and custom error classes.
// 2. Implement syncOrderWithRemote(orderId, fetchFn).
//    - Note: We pass fetchFn as an argument to make testing easy without monkey-patching globals.
// 3. Throw NotFoundError if HTTP status is 404.
// 4. Throw RemoteServiceError with the status code if HTTP status is 500+.
// 5. Treat only status 200 as success; throw Error(`Unexpected HTTP status: ${status}`) for other statuses.
// 6. Wrap fetchFn rejections in NetworkError; do not classify JSON parsing or validation errors as network failures.
// 7. Validate the response JSON at runtime as a RemoteOrder. Reject invalid payloads with TypeError.
// 8. Return the validated RemoteOrder on success.
// ============================================================================

export interface RemoteOrder {
  id: string;
  externalRef: string;
  amount: number;
  isPaid: boolean;
}

export class NotFoundError extends Error {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} was not found.`);
    this.name = "NotFoundError";
  }
}

export class RemoteServiceError extends Error {
  constructor(public statusCode: number) {
    super(`Remote service responded with status: ${statusCode}`);
    this.name = "RemoteServiceError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(`Network request failed: ${message}`);
    this.name = "NetworkError";
  }
}

export type FetchFunction = (url: string) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

export async function syncOrderWithRemote(
  orderId: string,
  fetchFn: FetchFunction
): Promise<RemoteOrder> {
  // TODO: Implement the fetch logic, status checks, try/catch, and error throwing.
  throw new Error("Not implemented yet");
}