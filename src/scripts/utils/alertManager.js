export function showGasAlert(message) {
    Swal.fire({
      title: 'Peringatan Gas!',
      text: `Terdeteksi gas - ${message}`,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
  
  export function showApiAlert() {
    Swal.fire({
      title: 'Peringatan Api!',
      text: 'Terdeteksi api! Segera cek gas LPG kamu!',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  export function showConnectionStatusAlert(title) {
    Swal.fire({
      position: "bottom",
      title: `${title}`,
      showConfirmButton: false,
      timer: 1500
    });
  }
  