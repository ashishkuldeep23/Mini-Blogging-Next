'use client'

// import { useRouter } from "next/navigation"

// function useRouterPushWithTransition(url: string) {
//     const router = useRouter()
//     return router.push(url)
// }



// function sleep(ms: number): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, ms))
// }



export default function bodyTranstion() {

    let body = document.querySelector('body')

    body?.classList.add("page_transition");

    // sleep(1000)

    setTimeout(() => {
        body?.classList.remove("page_transition");
    }, 650)
}



