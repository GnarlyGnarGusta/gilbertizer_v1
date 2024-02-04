import { useEffect } from "react";

export default function useEnginePatchEffect(patch, destination) {
  useEffect(() => {
    if (destination) {
      const disconnect = patch(destination);

      return () => {
        disconnect();
      };
    }
  }, [patch, destination]);
}
