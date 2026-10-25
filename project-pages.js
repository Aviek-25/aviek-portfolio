
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("finMapTheme") || "light";

document.body.setAttribute("data-theme", savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("finMapTheme", newTheme);
  });
}
