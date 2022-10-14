import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
    static async getInitialProps(context: DocumentContext) {
        const initialProps = await Document.getInitialProps(context);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default CustomDocument;
