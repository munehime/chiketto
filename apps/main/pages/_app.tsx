import { AppProps } from "next/app";

import "@chiketto/shared/styles/globals.css";

import "../common/styles/main.css";
import { Layout } from "../common/components";

const App = ({ Component, pageProps, router }: AppProps) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default App;
