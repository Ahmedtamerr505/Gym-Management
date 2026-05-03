export const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decodedPayload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};