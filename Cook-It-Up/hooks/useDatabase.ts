import { useState, useCallback } from "react";
import { db } from "../services/databaseService";

export function useDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleOperation = useCallback(
    async <T>(operation: () => Promise<T>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await operation();
        return result;
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An error occurred"));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // User operations
  const createUser = useCallback(
    (name: string, email: string, password: string) =>
      handleOperation(() => db.createUser(name, email, password)),
    [handleOperation]
  );

  const getUser = useCallback(
    (id: number) => handleOperation(() => db.getUser(id)),
    [handleOperation]
  );

  // Pantry operations
  const createPantry = useCallback(
    (userId: number, name: string) =>
      handleOperation(() => db.createPantry(userId, name)),
    [handleOperation]
  );

  const getUserPantries = useCallback(
    (userId: number) => handleOperation(() => db.getUserPantries(userId)),
    [handleOperation]
  );

  // Pantry items operations
  const addPantryItem = useCallback(
    (
      pantryId: number,
      name: string,
      quantity: number,
      unit: string,
      expiryDate?: Date
    ) =>
      handleOperation(() =>
        db.addPantryItem(pantryId, name, quantity, unit, expiryDate)
      ),
    [handleOperation]
  );

  const updatePantryItem = useCallback(
    (
      id: number,
      data: {
        name?: string;
        quantity?: number;
        unit?: string;
        expiryDate?: Date;
      }
    ) => handleOperation(() => db.updatePantryItem(id, data)),
    [handleOperation]
  );

  const deletePantryItem = useCallback(
    (id: number) => handleOperation(() => db.deletePantryItem(id)),
    [handleOperation]
  );

  // Preferences and allergies operations
  const addPreference = useCallback(
    (
      userId: number,
      name: string,
      type: "LIKE" | "DISLIKE" | "DIETARY_RESTRICTION"
    ) => handleOperation(() => db.addPreference(userId, name, type)),
    [handleOperation]
  );

  return {
    loading,
    error,
    // User operations
    createUser,
    getUser,
    // Pantry operations
    createPantry,
    getUserPantries,
    // Pantry items operations
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
    // Preferences and allergies operations
    addPreference,
  };
}
