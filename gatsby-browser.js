import 'prism-themes/themes/prism-material-dark.css';

export const onInitialClientRender = () => {
    if (typeof window !== "undefined") {
      const currentDomain = window.location.hostname;
      const referrer = document.referrer;
  
      // Redirect condition
      if (currentDomain === "yangdongs.web.app" && !referrer.includes("hyeondong.com")) {
        window.location.replace("https://hyeondong.com");
      }
    }
  };