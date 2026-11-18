import {Suspense} from "react";
import RedirectToOriginalUrl from "@/components/RedirectToOriginalUrl";

export default function AliasPage({params}: {params: Promise<{alias: string}>}) {
    return (
        <Suspense fallback={<p>Redirecting...</p>}>
            <RedirectToOriginalUrl params={params}/>
        </Suspense>
    );
}
