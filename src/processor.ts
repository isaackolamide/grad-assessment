// ============================================================================
// CHALLENGE 2: COMPLEX DATA STRUCTURES & REFACTORING
//
// Rules:
// 1. Define explicit types for RawOrderItem and SkuSummary. NO `any`.
// 2. Process an Array of Arrays (batches of items).
// 3. Reconcile inventory:
//    - If status === "completed" AND qty > 0:
//        revenue += qty * unitPrice, volume += qty
//    - If status === "refunded":
//        revenue -= Math.abs(qty) * unitPrice, volume -= Math.abs(qty)
//    - Ignore items where qty <= 0 and status is NOT "refunded".
// 4. Group by SKU and return Record<string, SkuSummary>.
// ============================================================================

export type ItemStatus = "completed" | "refunded" | "cancelled" | "pending";

// TODO: Define RawOrderItem interface
export interface RawOrderItem {
  id: number;
  sku: string;
  qty: number;
  unitPrice: number;
  status: ItemStatus;
}

// TODO: Define SkuSummary interface
export interface SkuSummary {
  sku: string;
  totalVolume: number;
  totalRevenue: number;
  orderCount: number;
}

/**
 * Takes a 2D array of order items (batches) and returns a summary grouped by SKU.
 */
export function reconcileBatches(batches: RawOrderItem[][]): Record<string, SkuSummary> {
  const summaryMap: Record<string, SkuSummary> = {};

  // TODO: Implement loops / transformations here.
  // Handle edge cases:
  // - Discard cancelled/pending items
  // - Correctly update totalVolume and totalRevenue for refunds vs completed
  // - Increment orderCount for every processed item

  return summaryMap;
}