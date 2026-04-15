import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

export function useActor() {
  const { actor, isFetching } = useCoreActor(createActor);
  return { actor, isFetching };
}
