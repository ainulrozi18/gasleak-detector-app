import { CONFIG } from "../globals/config";

export async function registerPush() {
  try {
    const registration = await navigator.serviceWorker.ready;

    let subscription;
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
      });
    } catch (subscribeError) {
      console.error("Error during push subscription:", subscribeError);
      throw subscribeError; // Lanjutkan melempar error agar bisa ditangkap di luar.
    }

    try {
      await fetch(`${CONFIG.BACKEND_URL}/subscribe`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (fetchError) {
      console.error("Error while sending subscription to backend:", fetchError);
      throw fetchError; // Pastikan error dikembalikan untuk penanganan lebih lanjut.
    }
  } catch (error) {
    console.error("Error in registerPush function:", error);
  }
}

function urlBase64ToUint8Array(base64String) {
  try {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  } catch (error) {
    console.error("Error in urlBase64ToUint8Array function:", error);
    throw error; // Lempar ulang error jika ada kegagalan di sini.
  }
}