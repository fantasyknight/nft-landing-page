/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        banner: "url('./assets/images/home/banner.png')",
        image1: "url('./assets/images/home/image1.png')",
        image2: "url('./assets/images/home/image2.png')",
        icon1: "url('./assets/images/home/icon1.svg')",
        icon2: "url('./assets/images/home/icon2.svg')",
        icon3: "url('./assets/images/home/icon3.svg')",
        icon4: "url('./assets/images/home/icon4.svg')",
        link: "url('./assets/images/home/link-external.svg')",
        logo: "url('./assets/images/logo.png')",
        hidden: "url('./assets/images/header/hidden.png')",
        user: "url('./assets/images/header/user.png')",
        dashboard: "url('./assets/images/sidebar/dashboard.svg')",
        profile: "url('./assets/images/sidebar/profile.svg')",
        faq: "url('./assets/images/sidebar/faq.svg')",
        analytics: "url('./assets/images/sidebar/analytics.svg')",
        staking: "url('./assets/images/sidebar/staking.svg')",
        twitter: "url('./assets/images/sidebar/twitter.svg')",
        discord: "url('./assets/images/sidebar/discord.svg')",
        "sidebar-bgcolor":
          "linear-gradient(170.52deg, #1B192B 21.73%, rgba(27, 25, 43, 0.05) 77.83%);",
        "dashboard-backcolor":
          "linear-gradient(124.03deg, rgba(0, 0, 0, 0.51) 0%, rgba(15, 16, 26, 0) 100%)",
        "dashboard-card1-bgcolor":
          "radial-gradient(100% 400% at 0% 0%, rgba(206, 156, 82, 0.026) 0%, rgba(37, 39, 62, 0.299) 57.81%, rgba(15, 16, 26, 0.65) 98.44%)",
        "dashboard-card2-bgcolor":
          "linear-gradient(124.78deg, #2E2D3A 0%, rgba(27, 25, 43, 0) 100%)",
        "dashboard-card2-interior1-bgcolor":
          "linear-gradient(109.17deg, rgba(0, 0, 0, 0.09) 0%, rgba(206, 82, 82, 0.33) 99.99%, #12191D 100%)",
        "dashboard-card2-interior2-bgcolor":
          "linear-gradient(109.17deg, rgba(0, 0, 0, 0.09) 0%, rgba(130, 192, 82, 0.15) 99.98%, rgba(206, 82, 82, 0.33) 99.99%, #12191D 100%)",
        "dashboard-card2-interior3-bgcolor":
          "linear-gradient(109.17deg, rgba(0, 0, 0, 0.09) 0%, rgba(130, 192, 82, 0.15) 99.98%, rgba(206, 82, 82, 0.33) 99.99%, #12191D 100%)",
        "dashboard-button1-bgcolor":
          "linear-gradient(96.04deg, #7C98A9 1.2%, rgba(124, 152, 169, 0.6) 100%)",
        "dashboard-buttonwrapper-bgcolor":
          "linear-gradient(91.67deg, #272942 0%, rgba(39, 41, 66, 0.44) 100%)",
        "input-box-bgcolor":
          "linear-gradient(170.52deg, #000000 21.73%, rgba(0, 0, 0, 0.05) 77.83%)",
        "fee-panel-bgcolor":
          "radial-gradient(100% 400% at 0% 0%, rgba(158, 159, 95, 0.026) 0%, rgba(37, 39, 62, 0.299) 57.81%, rgba(15, 16, 26, 0.65) 98.44%)",
        "profile-card-bgcolor":
          "linear-gradient(124.78deg, #2E2D3A 0%, rgba(27, 25, 43, 0) 100%)",
        "profile-card-inner-bgcolor":
          "linear-gradient(109.17deg, rgba(0, 0, 0, 0.09) 0%, rgba(206, 82, 82, 0.33) 99.99%, #12191D 100%)",
        "profile-card-inner2-bgcolor":
          "linear-gradient(109.17deg, rgba(0, 0, 0, 0.09) 0%, rgba(130, 192, 82, 0.15) 99.98%, rgba(206, 82, 82, 0.33) 99.99%, #12191D 100%)",
      }),
    },
  },
  plugins: [],
};
