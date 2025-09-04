import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  showConfirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Create modal element
      const modalElement = document.createElement('div');
      modalElement.className = 'modal fade';
      modalElement.setAttribute('tabindex', '-1');
      modalElement.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              ${message}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirmBtn">Confirm</button>
            </div>
          </div>
        </div>
      `;

      // Add modal to body
      document.body.appendChild(modalElement);

      // Initialize modal
      const modal = new Modal(modalElement);

      // Handle confirm button click
      const confirmBtn = modalElement.querySelector('#confirmBtn');
      confirmBtn?.addEventListener('click', () => {
        modal.hide();
        resolve(true);
      });

      // Handle cancel/close
      modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
        resolve(false);
      });

      // Show modal
      modal.show();
    });
  }

  showAlert(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      // Create modal element
      const modalElement = document.createElement('div');
      modalElement.className = 'modal fade';
      modalElement.setAttribute('tabindex', '-1');
      modalElement.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              ${message}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      `;

      // Add modal to body
      document.body.appendChild(modalElement);

      // Initialize modal
      const modal = new Modal(modalElement);

      // Handle close
      modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
        resolve();
      });

      // Show modal
      modal.show();
    });
  }
}
