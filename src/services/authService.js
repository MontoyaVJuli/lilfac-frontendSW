import axios from "axios";

const KEYCLOAK_URL  = process.env.REACT_APP_KEYCLOAK_URL  || "http://localhost:8090";
const REALM         = process.env.REACT_APP_KEYCLOAK_REALM  || "lilfac";
const CLIENT_ID     = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "lilfac-frontend";

function parseJwt(token) {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}

function extractRole(payload) {
    const roles = payload?.realm_access?.roles || [];
    const priority = ["ADMIN", "CAJA", "BODEGA", "LOGISTICA"];
    return priority.find((r) => roles.includes(r)) || roles[0] || "USER";
}

export const authService = {
    login: async (username, password) => {
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("client_id", CLIENT_ID);
        params.append("username", username);
        params.append("password", password);

        const { data } = await axios.post(
            `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
            params,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 15000 }
        );

        const payload = parseJwt(data.access_token);
        return {
            token: data.access_token,
            user: {
                id:       payload.sub,
                username: payload.preferred_username || username,
                role:     extractRole(payload),
            },
        };
    },
};
