import { Injectable } from '@angular/core';
import { Toast } from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  showSuccess(message: string): void {
    this.showToast(message, 'success', 'Success');
  }

  showError(message: string): void {
    this.showToast(message, 'danger', 'Error');
  }

  showInfo(message: string): void {
    this.showToast(message, 'info', 'Info');
  }

  showWarning(message: string): void {
    this.showToast(message, 'warning', 'Warning');
  }

  private showToast(message: string, type: string, title: string): void {
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.setAttribute('role', 'alert');
    toastElement.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;

    // Get or create toast container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Initialize and show toast
    const toast = new Toast(toastElement, {
      autohide: true,
      delay: 3000
    });
    toast.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }
}
