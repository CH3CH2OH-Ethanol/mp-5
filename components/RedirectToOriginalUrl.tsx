import getOriginalUrl from "@/lib/getOriginalUrl";
import {notFound, redirect} from "next/navigation";

export default async function RedirectToOriginalUrl({params}: {params: Promise<{alias: string}>}) {
    const {alias} = await params;
    const originalUrl = await getOriginalUrl(alias);

    if (!originalUrl) {
        return notFound();
    }

    return redirect(originalUrl);
}
