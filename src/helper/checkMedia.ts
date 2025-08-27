import { useState } from "react";

type ApiReturnType = {
  confidence: number;
  details: {
    nudity: {};
    weapons_alcohol_drugs: 0;
    offensive: 0.001;
    gore: 0.001;
  };
  filename: string;
  ok: boolean;
  reasons: string[];
  size: number;
  type: string;
};

async function checkMedia(file: File): Promise<ApiReturnType> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/checkMedia", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  console.log(data.ok ? "✅ Safe! You can post this." : "❌ Not allowed.");

  return data;
}

const useMediaCheckHook = () => {
  const [mediaCheck, setMediaCheck] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reasons, setReasons] = useState<string[]>([]);

  const checkMediaHnadler = async (file: File) => {
    try {
      setIsLoading(true);
      const data = await checkMedia(file);
      console.log({ MediaCheckRes: data });
      if (data.ok) {
        setMediaCheck(true);
        return true;
      } else {
        setMediaCheck(false);
        setReasons(data.reasons);
        return false;
      }
    } catch (error) {
      console.log(error);
      setMediaCheck(false);
      setReasons([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { mediaCheck, checkMediaHnadler, isLoading, reasons };
};

export default useMediaCheckHook;

export { checkMedia };
