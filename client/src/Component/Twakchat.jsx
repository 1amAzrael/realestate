import { useEffect } from 'react';

let isTawkScriptLoaded = false;

const TawkChat = () => {
  useEffect(() => {
    if (!isTawkScriptLoaded) {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/67eb7b275b2a6f190f21862c/1innti5f2';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
      isTawkScriptLoaded = true;
    }

    return () => {
      // Avoid script removal here to persist across routes unless full page refresh
    };
  }, []);

  return null;
};

export default TawkChat;
