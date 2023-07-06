import "../styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "../context/auth";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_SERVER_URL + "/api";
  Axios.defaults.withCredentials = true;

  return (
    <AuthProvider>
      {!authRoute && <NavBar />}

      <div className={authRoute ? "" : "pt-16 bg-gray-200 min-h-screen"}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
