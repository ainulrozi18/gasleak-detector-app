// import { CONFIG } from "../globals/config";

// export async function registerPush() {
//   try {
//     const registration = await navigator.serviceWorker.ready;

//     let subscription;
//     try {
//       subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
//       });
//     } catch (subscribeError) {
//       console.error("Error during push subscription:", subscribeError);
//       throw subscribeError; // Lanjutkan melempar error agar bisa ditangkap di luar.
//     }

//     try {
//       await fetch(`${CONFIG.BACKEND_URL}/subscribe`, {
//         method: "POST",
//         body: JSON.stringify(subscription),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     } catch (fetchError) {
//       console.error("Error while sending subscription to backend:", fetchError);
//       throw fetchError; // Pastikan error dikembalikan untuk penanganan lebih lanjut.
//     }
//   } catch (error) {
//     console.error("Error in registerPush function:", error);
//   }
// }

// function urlBase64ToUint8Array(base64String) {
//   try {
//     const padding = "=".repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//     const rawData = window.atob(base64);
//     return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
//   } catch (error) {
//     console.error("Error in urlBase64ToUint8Array function:", error);
//     throw error; // Lempar ulang error jika ada kegagalan di sini.
//   }
// }

import { CONFIG } from "../globals/config";

// Keep track of subscription status to prevent duplicate registrations
let subscriptionActive = false;

export async function registerPush() {
  // Don't re-register if already subscribed
  if (subscriptionActive) {
    console.log("Push notifications already registered");
    return;
  }

  try {
    // Check if the browser supports push notifications
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn("Push notifications not supported in this browser");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Check if we already have a subscription
    const existingSubscription = await registration.pushManager.getSubscription();
    
    if (existingSubscription) {
      // Update the server with our existing subscription
      await sendSubscriptionToServer(existingSubscription);
      subscriptionActive = true;
      return;
    }

    // Create a new subscription
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
      });
      
      await sendSubscriptionToServer(subscription);
      subscriptionActive = true;
      console.log("Push notification subscription successful");
    } catch (subscribeError) {
      console.error("Error during push subscription:", subscribeError);
      
      // If permission was denied, handle gracefully
      if (Notification.permission === 'denied') {
        console.warn("Push notification permission denied by user");
      }
      
      throw subscribeError;
    }
  } catch (error) {
    console.error("Error in registerPush function:", error);
  }
}

// New function to unsubscribe from push notifications
export async function unregisterPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // First inform the server
      await fetch(`${CONFIG.BACKEND_URL}/unsubscribe`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      // Then unsubscribe locally
      await subscription.unsubscribe();
      subscriptionActive = false;
      console.log("Successfully unsubscribed from push notifications");
    }
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
  }
}

// Helper function to send subscription to server
async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/subscribe`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (fetchError) {
    console.error("Error sending subscription to server:", fetchError);
    throw fetchError;
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
    throw error;
  }
}

// Check notification permission status
export function getNotificationPermissionStatus() {
  return Notification.permission;
}

// Add this to your app initialization or user engagement point
export async function setupPushNotifications() {
  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.warn("This browser does not support notifications");
    return;
  }
  
  // If permission is already granted, register push
  if (Notification.permission === 'granted') {
    await registerPush();
  } 
  // If permission hasn't been asked yet
  else if (Notification.permission === 'default') {
    try {
      // Request permission and register if granted
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await registerPush();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }
}