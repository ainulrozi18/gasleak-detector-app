function sweetAlertCheck() {
  if (typeof Swal === 'undefined') {
    console.error('SweetAlert2 is not loaded!');
    return;
  }
}

export function showGasAlert(message) {
  sweetAlertCheck()
  Swal.fire({
    title: 'Peringatan Gas!',
    text: `Terdeteksi gas - ${message}`,
    icon: 'warning',
    confirmButtonText: 'OK'
  });
}

export function showApiAlert() {
    sweetAlertCheck()
    Swal.fire({
      title: 'Peringatan Api!',
      text: 'Terdeteksi api! Segera cek gas LPG kamu!',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  export function showConnectionStatusAlert(title) {
    sweetAlertCheck()
    Swal.fire({
      position: "bottom",
      title: `${title}`,
      showConfirmButton: false,
      timer: 1500
    });
  }
  