
import toast from "react-hot-toast";

// export async function uploadFileInCloudinary(file: File): Promise<string> {
//   try {
//     const urlForCloudinary =
//       CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dlvq8n2ca/upload";
//     const preset_key = CLOUDINARY_PRESET || "crzz0lfv";

//     if (!preset_key || !urlForCloudinary) {
//       toast.error("Imp. data is missing. Devloper err.");
//       return "";
//     }

//     const now = Date.now();
//     const myRenamedFile = new File([file], `${now}_${file.name}`);

//     // console.log(myRenamedFile);

//     let formData = new FormData();

//     formData.append("file", myRenamedFile);
//     formData.append("upload_preset", preset_key);
//     formData.append("folder", "MiniBlogging");

//     // let request = await fetch.post(urlForCloudinary, formData)
//     let request = await fetch(urlForCloudinary, {
//       method: "POST",
//       body: formData,
//     });

//     // console.log({ request })

//     let json = await request.json();

//     // console.log({ json })

//     return json.url;
//   } catch (error: any) {
//     console.log(error.message);

//     toast.error(`${error.message}`);

//     return "";
//   }
// }

// // // back to previous logic only returning the url --------->
export async function PostFileInCloudinary(file: File): Promise<string> {
  try {
    // const urlForCloudinary =
    //   CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dlvq8n2ca/upload";
    // const preset_key = CLOUDINARY_PRESET || "crzz0lfv";

    // if (!preset_key || !urlForCloudinary) {
    //   toast.error("Imp. data is missing. Devloper err.");
    //   return "";
    // }

    // const now = Date.now();
    // const myRenamedFile = new File([file], `${now}_${file.name}`);

    // console.log(myRenamedFile);

    const formData = new FormData();
    formData.append("file", file);

    // let request = await fetch.post(urlForCloudinary, formData)
    let request = await fetch("/api/uplaod", {
      method: "POST",
      body: formData,
    });

    // console.log({ request })

    let json = await request.json();

    console.log({ json });
    if (json?.success) {
      return json?.data?.url;
    } else {
      return "";
    }
  } catch (error: any) {
    console.log(error.message);

    toast.error(`${error.message}`);

    return "";
  }
}
export async function PutFileInCloudinary(
  file: File,
  publicId: string
): Promise<{ url: string; publicId: string }> {
  try {
    // const urlForCloudinary =
    //   CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dlvq8n2ca/upload";
    // const preset_key = CLOUDINARY_PRESET || "crzz0lfv";

    // if (!preset_key || !urlForCloudinary) {
    //   toast.error("Imp. data is missing. Devloper err.");
    //   return "";
    // }

    // const now = Date.now();
    // const myRenamedFile = new File([file], `${now}_${file.name}`);

    // console.log(myRenamedFile);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicId", publicId);

    // let request = await fetch.post(urlForCloudinary, formData)
    let request = await fetch("/api/uplaod", {
      method: "PUT",
      body: formData,
    });

    // console.log({ request })

    let json = await request.json();

    // console.log({ json });
    if (json?.success) {
      return { url: json?.data?.url, publicId: json?.data?.publicId };
    } else {
      return { url: "", publicId: "" };
    }

    return { url: json.url, publicId: json.publicId };
  } catch (error: any) {
    console.log(error.message);

    toast.error(`${error.message}`);

    return { url: "", publicId: "" };
  }
}
export async function DeleteFileInCloudinary(
  publicId: string
): Promise<{ url: string; publicId: string }> {
  try {
    // const urlForCloudinary =
    //   CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dlvq8n2ca/upload";
    // const preset_key = CLOUDINARY_PRESET || "crzz0lfv";

    // if (!preset_key || !urlForCloudinary) {
    //   toast.error("Imp. data is missing. Devloper err.");
    //   return "";
    // }

    // const now = Date.now();
    // const myRenamedFile = new File([file], `${now}_${file.name}`);

    // console.log(myRenamedFile);

    const formData = new FormData();
    formData.append("publicId", publicId);

    // let request = await fetch.post(urlForCloudinary, formData)
    let request = await fetch("/api/uplaod", {
      method: "DELETE",
      body: formData,
    });

    // console.log({ request })

    let json = await request.json();

    // console.log({ json })
    if (json?.success) {
      return { url: json.data, publicId: "" };
    } else {
      return { url: "", publicId: "" };
    }
  } catch (error: any) {
    console.log(error.message);

    toast.error(`${error.message}`);

    return { url: "", publicId: "" };
  }
}

