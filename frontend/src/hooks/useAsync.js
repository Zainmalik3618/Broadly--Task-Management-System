import { useState } from "react";

export const useAsync = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const run = async (action) => {
    setPending(true);
    setError("");
    try {
      return await action();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setPending(false);
    }
  };

  return { pending, error, setError, run };
};
