import { describe, it, expect, vi } from "vitest";
import { processPayment } from "../src/types.js";
import { reconcileBatches, RawOrderItem } from "../src/processor.js";
import {
  syncOrderWithRemote,
  NotFoundError,
  RemoteServiceError,
  NetworkError,
  FetchFunction,
} from "../src/service.js";
import {
  getFilteredUserTodos,
  getMultiUserTodoStats,
  Todo,
  Fetcher,
} from "../src/todoApi.js";

describe("Challenge 1: Types & Pattern Matching", () => {
  it("processes credit card payment", () => {
    const result = processPayment({
      kind: "card",
      amount: 150,
      cardNumber: "4111222233334444",
      cvv: "123",
    });
    expect(result).toBe("Processed card ending with 4444 for $150");
  });

  it("processes crypto payment", () => {
    const result = processPayment({
      kind: "crypto",
      amount: 500,
      walletAddress: "0xABC123",
      network: "ETH",
    });
    expect(result).toBe("Processed crypto on ETH to 0xABC123 for $500");
  });

  it("processes bank payment", () => {
    const result = processPayment({
      kind: "bank",
      amount: 1200,
      iban: "DE89370400440532013000",
      bic: "DBEUTTMM",
    });
    expect(result).toBe("Processed bank transfer to DE89370400440532013000 for $1200");
  });
});

describe("Challenge 2: Data Structures & Processing", () => {
  it("aggregates multi-batch orders correctly", () => {
    const batch1: RawOrderItem[] = [
      { id: 1, sku: "SKU-A", qty: 2, unitPrice: 10, status: "completed" },
      { id: 2, sku: "SKU-B", qty: 1, unitPrice: 20, status: "completed" },
      { id: 3, sku: "SKU-A", qty: 0, unitPrice: 10, status: "completed" }, // Should be ignored (qty <= 0)
    ];

    const batch2: RawOrderItem[] = [
      { id: 4, sku: "SKU-A", qty: 1, unitPrice: 10, status: "refunded" }, // Should reduce volume and revenue
      { id: 5, sku: "SKU-B", qty: 5, unitPrice: 20, status: "cancelled" }, // Should be ignored
      { id: 6, sku: "SKU-A", qty: 3, unitPrice: 10, status: "completed" },
    ];

    const result = reconcileBatches([batch1, batch2]);

    expect(result["SKU-A"]).toEqual({
      sku: "SKU-A",
      totalVolume: 4, // (2 completed - 1 refunded + 3 completed)
      totalRevenue: 40, // (20 - 10 + 30)
      orderCount: 3, // processed 3 valid events for SKU-A
    });

    expect(result["SKU-B"]).toEqual({
      sku: "SKU-B",
      totalVolume: 1,
      totalRevenue: 20,
      orderCount: 1,
    });
  });
});

describe("Challenge 3: Async, API & Error Handling", () => {
  it("resolves order on 200 response", async () => {
    const mockFetch: FetchFunction = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: "ord-123",
        externalRef: "REF-999",
        amount: 250,
        isPaid: true,
      }),
    });

    const order = await syncOrderWithRemote("ord-123", mockFetch);
    expect(order.id).toBe("ord-123");
    expect(order.isPaid).toBe(true);
  });

  it("throws NotFoundError on 404 response", async () => {
    const mockFetch: FetchFunction = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not Found" }),
    });

    await expect(syncOrderWithRemote("ord-999", mockFetch)).rejects.toThrow(NotFoundError);
  });

  it("wraps raw network failures in NetworkError", async () => {
    const mockFetch: FetchFunction = vi.fn().mockRejectedValue(new Error("Connection reset"));

    await expect(syncOrderWithRemote("ord-123", mockFetch)).rejects.toThrow(NetworkError);
  });

  it("rejects unexpected non-success HTTP statuses", async () => {
    const mockFetch: FetchFunction = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Bad Request" }),
    });

    await expect(syncOrderWithRemote("ord-123", mockFetch)).rejects.toThrow(
      "Unexpected HTTP status: 400"
    );
  });

  it("rejects a malformed remote order payload", async () => {
    const mockFetch: FetchFunction = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: "ord-123",
        externalRef: "REF-999",
        amount: "250",
        isPaid: true,
      }),
    });

    await expect(syncOrderWithRemote("ord-123", mockFetch)).rejects.toBeInstanceOf(TypeError);
  });

  // ==========================================================================
  // TODO: ASSESSMENT TASK FOR CHRISTINE & SHEN FUNG:
  // Write a unit test below that tests what happens when the remote service returns
  // an HTTP 500 error. It must assert that `RemoteServiceError` is thrown.
  // ==========================================================================
  it.todo("throws RemoteServiceError when status is 500");
});

describe("Challenge 4: JSONPlaceholder API & Parallel Execution", () => {
  const mockTodos: Todo[] = [
    { userId: 1, id: 1, title: "Write tests", completed: true },
    { userId: 1, id: 2, title: "Review PR", completed: false },
    { userId: 1, id: 3, title: "Fix CI", completed: true },
    { userId: 2, id: 4, title: "Deploy prod", completed: false },
  ];

  it("filters todos by userId and completed status", async () => {
    const mockFetch: Fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockTodos,
    });

    const result = await getFilteredUserTodos(1, true, mockFetch);

    expect(result).toHaveLength(2);
    expect(result.every((t) => t.userId === 1 && t.completed === true)).toBe(true);
    expect(result.map((t) => t.id)).toEqual([1, 3]);
  });

  it("throws error if the fetch response fails", async () => {
    const mockFetch: Fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(getFilteredUserTodos(1, true, mockFetch)).rejects.toThrow("HTTP Error 500");
  });

  it("rejects malformed todo payloads", async () => {
    const mockFetch: Fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ userId: 1, id: 1, title: 42, completed: true }],
    });

    await expect(getFilteredUserTodos(1, true, mockFetch)).rejects.toBeInstanceOf(TypeError);
    await expect(getMultiUserTodoStats([1], mockFetch)).rejects.toBeInstanceOf(TypeError);
  });

  it("starts all user requests before any response resolves and compiles stats", async () => {
    let releaseResponses: () => void = () => {};
    const responsesPending = new Promise<void>((resolve) => {
      releaseResponses = resolve;
    });
    const mockFetch = vi.fn<Fetcher>(async (url: string) => {
      await responsesPending;
      const userId = url.includes("userId=1") ? 1 : 2;
      return {
        ok: true,
        status: 200,
        json: async () => mockTodos.filter((todo) => todo.userId === userId),
      };
    });

    const statsPromise = getMultiUserTodoStats([1, 2], mockFetch);
    const callsBeforeResponsesResolve = mockFetch.mock.calls.length;
    releaseResponses();
    const stats = await statsPromise;

    expect(callsBeforeResponsesResolve).toBe(2);

    // Verify correct aggregation
    expect(stats[1]).toEqual({
      userId: 1,
      total: 2,
      completedCount: 1,
    });

    expect(stats[2]).toEqual({
      userId: 2,
      total: 3,
      completedCount: 2,
    });

  });

  // ==========================================================================
  // TODO: ASSESSMENT TASK FOR CHRISTINE & SHEN FUNG (#2 of 2):
  // Write a unit test below that calls `getMultiUserTodoStats` with an empty array ([]).
  // It must verify:
  // 1. It resolves to an empty object `{}`.
  // 2. The mock `fetchFn` was never called (0 times).
  // ==========================================================================
  it.todo("returns an empty stats record and does not invoke fetch when userIds is empty");
});