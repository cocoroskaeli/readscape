export const setDarkModeOnHtml = (enabled: boolean) => {
  const html = document.documentElement;
  if (enabled) html.classList.add('dark');
  else html.classList.remove('dark');
};