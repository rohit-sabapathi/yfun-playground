export type DiffType = "NEW_FIELD" | "REMOVED_FIELD" | "TYPE_MISMATCH" | "NULL_VALUE";

export interface DiffResult {
  path: string;
  type: DiffType;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baselineValue?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveValue?: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareSchemas(baseline: any, live: any, path = ""): DiffResult[] {
  let diffs: DiffResult[] = [];

  if (baseline === null && live !== null) {
    // If baseline was null, we can't infer schema, but getting a value now is fine.
    return diffs;
  }

  if (baseline !== null && live === null) {
    diffs.push({
      path: path || "root",
      type: "NULL_VALUE",
      message: `Field became null. Was ${typeof baseline}`,
      baselineValue: baseline,
      liveValue: null
    });
    return diffs;
  }

  if (typeof baseline !== typeof live) {
    // Exclude null checks as they are handled above.
    if (baseline !== null && live !== null) {
      diffs.push({
        path: path || "root",
        type: "TYPE_MISMATCH",
        message: `Type changed from ${typeof baseline} to ${typeof live}`,
        baselineValue: typeof baseline,
        liveValue: typeof live
      });
      return diffs;
    }
  }

  if (Array.isArray(baseline) && Array.isArray(live)) {
    // For arrays, we compare the first element's schema if it exists
    if (baseline.length > 0 && live.length > 0) {
      diffs = diffs.concat(compareSchemas(baseline[0], live[0], `${path}[0]`));
    } else if (baseline.length > 0 && live.length === 0) {
      diffs.push({
        path: path || "root",
        type: "NULL_VALUE",
        message: "Array became empty",
        baselineValue: "Array of items",
        liveValue: "[]"
      });
    }
    return diffs;
  }

  if (typeof baseline === "object" && baseline !== null && typeof live === "object" && live !== null) {
    const baselineKeys = new Set(Object.keys(baseline));
    const liveKeys = new Set(Object.keys(live));

    for (const key of baselineKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!liveKeys.has(key)) {
        diffs.push({
          path: currentPath,
          type: "REMOVED_FIELD",
          message: "Field removed in live response",
        });
      } else {
        diffs = diffs.concat(compareSchemas(baseline[key], live[key], currentPath));
      }
    }

    for (const key of liveKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!baselineKeys.has(key)) {
        diffs.push({
          path: currentPath,
          type: "NEW_FIELD",
          message: "New field detected in live response",
          liveValue: typeof live[key]
        });
      }
    }
  }

  return diffs;
}
