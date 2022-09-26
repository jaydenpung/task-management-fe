import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div style={{ marginLeft: "5vh", marginRight: "5vh" }}>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</div>
	);
}

export default MyApp;
