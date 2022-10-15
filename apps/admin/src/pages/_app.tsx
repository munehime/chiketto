import Router from "next/router";
import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import "@chiketto/shared/styles/globals.css";
import { Loader } from "@chiketto/ui";

import "../styles/main.css";
import { Layout } from "../common/components";

const App = ({ Component, pageProps, router }: AppProps) => {
    const [ loading, setLoading ] = useState<boolean>(false);

    useEffect(() => {
        const startLoading = () => setLoading(true);
        const endLoading = () => setLoading(false);

        Router.events.on("routeChangeStart", startLoading);
        Router.events.on("routeChangeComplete", endLoading);
        Router.events.on("routeChangeError", endLoading);

        return () => {
            Router.events.off("routeChangeStart", startLoading);
            Router.events.off("routeChangeComplete", endLoading);
            Router.events.off("routeChangeError", endLoading);
        };
    }, []);

    return (
    <Layout>
            {loading ? (
                <Loader/>
            ) : (
                <Component {...pageProps} />
            )}
        </Layout>
    );
};

export default App;
