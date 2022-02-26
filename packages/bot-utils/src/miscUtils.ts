import { createHash } from "node:crypto";
import type { BinaryLike } from "node:crypto";

/**
 * Hashes data using a specific hash type
 * @param data data to hash
 * @param hashType type of hash to use
 * @returns hash
 */
export function hash(data: BinaryLike, hashType: string) {
  const hash = createHash(hashType).update(data).digest("hex");
  return hash;
}
