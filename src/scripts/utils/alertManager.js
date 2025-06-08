function sweetAlertCheck() {
  if (typeof Swal === "undefined") {
    console.error("SweetAlert2 is not loaded!");
    return;
  }
}

export function showGasAlert(message) {
  sweetAlertCheck();

  let audio = new Audio("./audio/warning.mp3");
  audio.loop = true;
  audio.play();

  if ("vibrate" in navigator) {
    navigator.vibrate([500, 200, 500]); // Getar selama 500ms, jeda 200ms, lalu 500ms lagi
  }

  Swal.fire({
    title: "Peringatan Gas!",
    text: `Terdeteksi gas - ${message}`,
    icon: "warning",
    confirmButtonText: "OK",
    customClass: {
      icon: "custom-icon",
    },
  }).then(() => {
    // Hentikan audio saat pengguna menekan "OK"
    audio.pause();
    audio.currentTime = 0; // Reset ke awal
    navigator.vibrate(0);
  });
}

export function showApiAlert() {
  sweetAlertCheck();
  let audio = new Audio("./audio/warning.mp3");
  audio.loop = true;
  audio.play();

  if ("vibrate" in navigator) {
    navigator.vibrate([500, 200, 500]); // Getar selama 500ms, jeda 200ms, lalu 500ms lagi
  }

  Swal.fire({
    title: "Peringatan Api!",
    text: "Terdeteksi api! Segera cek gas LPG kamu!",
    icon: "warning",
    confirmButtonText: "OK",
    customClass: {
      icon: "custom-icon",
    },
  }).then(() => {
    audio.pause();
    audio.currentTime = 0; // Reset ke awal
    navigator.vibrate(0);
  });
}

export function showConnectionStatusAlert(title) {
  sweetAlertCheck();
  Swal.fire({
    position: "bottom",
    title: `${title}`,
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      title: "custom-title",
    },
  });
}
