export const setDarkModeOnHtml = (enabled: boolean) => {
  const html = document.documentElement;
  if (enabled) {
    html.setAttribute("data-theme", "dark");
  } else {
    html.setAttribute("data-theme", "light");
  }
};