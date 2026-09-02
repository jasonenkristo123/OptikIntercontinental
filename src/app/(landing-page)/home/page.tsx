import { getFrames } from "@/app/actions/frameActions";
import HomeContainer from "@/features/landing-page/container/HomeContainer";

export default async function Home() {
    const frames = await getFrames();

    return <HomeContainer frames={frames} />
}