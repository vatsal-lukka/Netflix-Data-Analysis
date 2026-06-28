import netflixData from "@/public/netflix.json";
import { Dashboard } from "@/components/Dashboard";
import type { NetflixPayload } from "@/lib/helpers";

export default function Home() {
  return <Dashboard data={netflixData as NetflixPayload} />;
}
