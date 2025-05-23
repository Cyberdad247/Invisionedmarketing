import '../styles/globals.css';
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig 
      value={{
        fetcher: (url) => fetch(url).then(res => res.json()),
        revalidateOnFocus: false
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
