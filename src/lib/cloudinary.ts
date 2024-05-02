


const urlForCloudinary = process.env.CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/dlvq8n2ca/upload'
const preset_key = process.env.CLOUDINARY_PRESET || 'crzz0lfv'

// const urlForCloudinary = process.env.CLOUDINARY_URL!
// const preset_key = process.env.CLOUDINARY_PRESET!


export async function uploadFileInCloudinary(file: File) {

    // console.log({ urlForCloudinary, preset_key })


    if (!preset_key || !urlForCloudinary) {
        return alert("Imp data is missing. Devloper err.")
    }


    const now = Date.now()
    const myRenamedFile = new File([file], `${now}_${file.name}`);

    // console.log(myRenamedFile);


    let formData = new FormData()

    formData.append("file", myRenamedFile)
    formData.append("upload_preset", preset_key)

    // let request = await fetch.post(urlForCloudinary, formData)
    let request = await fetch(urlForCloudinary, { method: "POST", body: formData })

    // console.log({ request })

    let json = await request.json()

    // console.log({ json })


    return json.url





}
