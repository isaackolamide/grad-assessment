// ============================================================================
// CHALLENGE 4: REST API, FILTERING & PARALLEL PROMISES
//
// Rules:
// 1. Strictly type the Todo item based on JSONPlaceholder schema:
//    { userId: number; id: number; title: string; completed: boolean }
// 2. No `any`, `unknown as any`, `@ts-ignore`, or `@ts-expect-error`.
// 3. Implement getFilteredUserTodos():
//    - Fetch from https://jsonplaceholder.typicode.com/todos
//    - Filter todos belonging to a given `userId` AND matching `completed` state.
// 4. Implement getMultiUserTodoStats():
//    - Given an array of userIds: e.g. [1, 2, 3]
//    - MUST fetch their todos concurrently using Promise.all (NOT in a serial for-loop).
//    - Return a summary object mapping userId -> { total: number, completedCount: number }
// 5. If fetchFn rejects, propagate its rejection; do not swallow it or report it as an HTTP-status error.
// 6. Validate JSON at runtime as Todo[] in both functions; reject malformed payloads with TypeError.
// 7. For an empty userIds array, return {} without invoking fetchFn.
// ============================================================================

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface UserTodoStats {
  userId: number;
  total: number;
  completedCount: number;
}

export type Fetcher = (url: string) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

/**
 * Task 4A: Fetch todos from the API and filter them.
 */
export async function getFilteredUserTodos(
  userId: number,
  completed: boolean,
  fetchFn: Fetcher = fetch
): Promise<Todo[]> {
  const url = "https://jsonplaceholder.typicode.com/todos";

  // TODO:
  // 1. Call fetchFn(url).
  // 2. Check if response is ok, throw new Error(`HTTP Error ${res.status}`) if not.
  // 3. Parse and validate the JSON at runtime as Todo[]; reject malformed payloads with TypeError.
  // 4. Filter items where todo.userId === userId && todo.completed === completed.
  throw new Error("Not implemented");
}

/**
 * Task 4B: Parallel API Requests using Promise.all.
 *
 * Given a list of user IDs, fetch their respective todos simultaneously.
 * URL pattern: https://jsonplaceholder.typicode.com/todos?userId={userId}
 */
export async function getMultiUserTodoStats(
  userIds: number[],
  fetchFn: Fetcher = fetch
): Promise<Record<number, UserTodoStats>> {
  // TODO:
  // 1. Map `userIds` to an array of fetch Promises (fetching `todos?userId=${id}`).
  // 2. Resolve them concurrently using Promise.all.
  //    All fetchFn calls must start before any response is awaited.
  // 3. For each user's todos, compute:
  //    - total: total number of todos for that user
  //    - completedCount: count of todos with completed === true
  // 4. Return an aggregated Record<number, UserTodoStats>.
  // For an empty userIds array, return {} without calling fetchFn.
  throw new Error("Not implemented");
}