import Keycloak from "keycloak-js";

// Update these to match your Keycloak
const kc = new Keycloak({
  url: "http://localhost:8080", // base URL (no trailing slash ok)
  realm: "JBM",
  clientId: "test-web-app",
});

// "login-required" = force login (fast SSO if already logged in elsewhere)
kc.init({ 
  onLoad: "login-required", pkceMethod: "S256" 
})
  .then((authenticated) => {
    if (!authenticated) {
      kc.login();
      return;
    }

    const name =
      (kc.tokenParsed as any)?.name ||
      (kc.tokenParsed as any)?.preferred_username ||
      "user";

    const el = document.getElementById("app")!;
    el.innerHTML = `
      <h1>Hello, ${name} 👋</h1>
      <p>You are authenticated.</p>
      <button id="logout">Logout</button>
      <h3>ID Token (parsed)</h3>
      <pre id="token"></pre>
    `;

    document.getElementById("logout")!.addEventListener("click", () => kc.logout());

    // Keep token fresh (optional)
    setInterval(() => kc.updateToken(30).catch(() => kc.login()), 10000);

    (document.getElementById("token") as HTMLElement).textContent =
      JSON.stringify(kc.tokenParsed, null, 2);
  })
  .catch((err) => {
    console.error("Keycloak init failed:", err);
    document.getElementById("app")!.textContent =
      "Auth failed. Check the console for details.";
  });