import { useEffect } from "react";
import { useTimeout } from "./useTimout";

interface IUSeDebounce {
  callback: () => void;
  delay: number;
  dependencies: any[];
}
export const useDebounce = ({
  callback,
  delay,
  dependencies,
}: IUSeDebounce) => {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect( clear, []);
};
