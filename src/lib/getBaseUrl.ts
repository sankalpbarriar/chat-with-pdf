const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://pdf-speek-pro.vercel.app/";
export default getBaseUrl;
