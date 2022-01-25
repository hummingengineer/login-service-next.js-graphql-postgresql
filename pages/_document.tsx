import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

    try {
      // Step 2: Retrieve styles from components in the page
      // sheet을 사용해 정의된 모든 스타일을 수집
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      // Documents의 initial props
      const initialProps = await Document.getInitialProps(ctx);

      // Step 3: Extract the styles as <style> tags
      const styleTags = sheet.getStyleElement();

      // Step 4: Pass styleTags as a prop
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styleTags}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="ko">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
