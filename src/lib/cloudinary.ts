

import { CLOUDINARY_PRESET, CLOUDINARY_URL } from "@/constant"
import toast from "react-hot-toast"


export async function uploadFileInCloudinary(file: File): Promise<string> {

 
    try {

        const urlForCloudinary = CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/dlvq8n2ca/upload'
        const preset_key = CLOUDINARY_PRESET || 'crzz0lfv'


        if (!preset_key || !urlForCloudinary) {
            toast.error("Imp. data is missing. Devloper err.")
            return ""
        }


        const now = Date.now()
        const myRenamedFile = new File([file], `${now}_${file.name}`);

        // console.log(myRenamedFile);


        let formData = new FormData()

        formData.append("file", myRenamedFile)
        formData.append("upload_preset", preset_key)
        formData.append("folder", "MiniBlogging")

        // let request = await fetch.post(urlForCloudinary, formData)
        let request = await fetch(urlForCloudinary, { method: "POST", body: formData })

        // console.log({ request })

        let json = await request.json()

        // console.log({ json })


        return json.url
    } catch (error: any) {

        console.log(error.message)

        toast.error(`${error.message}`)

        return ""

    }

}
