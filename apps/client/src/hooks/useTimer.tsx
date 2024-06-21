import { useEffect, useState } from "react";

const useTimer = (initialTime: number = 60) => {
  const [time, setTime] = useState<number>(initialTime);

  useEffect(() => {
    if (time === 0) return;

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return {
    time,
    setTime,
  };
};

export default useTimer;
