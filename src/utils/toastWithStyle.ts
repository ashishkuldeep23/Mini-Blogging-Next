import toast from "react-hot-toast";

const toastError = (msg: string) => {
  return toast(msg, { style: { background: "#8C1007", color: "#fff" } });
};

export { toastError };
