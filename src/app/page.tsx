import { unstable_noStore as noStore } from "next/cache";
import RifaClient from "./RifaClient";
import { loadRifaState } from "../lib/rifa-data";

export default async function Home() {
  noStore();
  const { reserved, names } = await loadRifaState();
  const reservedList = [...reserved].sort((a, b) => a - b);

  return <RifaClient reservedList={reservedList} names={names} />;
}
