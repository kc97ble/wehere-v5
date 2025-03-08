import React, { useState } from "react";

export function useIsDeviceWidthLessThan(width: number): boolean | undefined {
  const [result, setResult] = useState<boolean>();

  React.useEffect(() => {
    const listener = () => {
      const newResult = window.innerWidth < width;
      if (result !== newResult) {
        setResult(newResult);
      }
    };

    listener();

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [result, width]);

  React.useEffect(() => {
    return () => {
      setResult(undefined);
    };
  }, []);

  return result;
}

export default useIsDeviceWidthLessThan;
