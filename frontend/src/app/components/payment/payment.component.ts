// components/payment/payment.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PaymentData {
  paymentMethod: 'card' | 'upi';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolderName?: string;
  upiId?: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() totalAmount: number = 0;
  @Output() paymentComplete = new EventEmitter<PaymentData>();
  @Output() paymentCancel = new EventEmitter<void>();

  paymentForm: FormGroup;
  selectedPaymentMethod: 'card' | 'upi' = 'card';
  showQRCode = false;
  qrCodeData = '';

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['card', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardHolderName: ['', [Validators.required, Validators.minLength(2)]],
      upiId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/)]]
    });
  }

  ngOnInit(): void {
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.selectedPaymentMethod = method;
      this.updateValidators();
    });
  }

  updateValidators(): void {
    const cardNumber = this.paymentForm.get('cardNumber');
    const expiryDate = this.paymentForm.get('expiryDate');
    const cvv = this.paymentForm.get('cvv');
    const cardHolderName = this.paymentForm.get('cardHolderName');
    const upiId = this.paymentForm.get('upiId');

    if (this.selectedPaymentMethod === 'card') {
      cardNumber?.setValidators([Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]);
      expiryDate?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      cvv?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
      cardHolderName?.setValidators([Validators.required, Validators.minLength(2)]);
      upiId?.clearValidators();
    } else {
      upiId?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/)]);
      cardNumber?.clearValidators();
      expiryDate?.clearValidators();
      cvv?.clearValidators();
      cardHolderName?.clearValidators();
    }

    cardNumber?.updateValueAndValidity();
    expiryDate?.updateValueAndValidity();
    cvv?.updateValueAndValidity();
    cardHolderName?.updateValueAndValidity();
    upiId?.updateValueAndValidity();
  }

  onPaymentMethodChange(method: 'card' | 'upi'): void {
    this.selectedPaymentMethod = method;
    this.paymentForm.patchValue({ paymentMethod: method });
    this.showQRCode = false;
  }

  generateUPIQR(): void {
    if (this.selectedPaymentMethod === 'upi' && this.paymentForm.get('upiId')?.valid) {
      const upiId = this.paymentForm.get('upiId')?.value;
      // Generate UPI payment URL
      this.qrCodeData = `upi://pay?pa=${upiId}&pn=BookStore&am=${this.totalAmount}&cu=INR&tn=Book Purchase`;
      this.showQRCode = true;
    }
  }

  processPayment(): void {
    if (this.paymentForm.valid) {
      const paymentData: PaymentData = {
        paymentMethod: this.selectedPaymentMethod,
        ...this.paymentForm.value
      };

      // For now, just place the order without actual payment verification
      this.paymentComplete.emit(paymentData);
    }
  }

  cancelPayment(): void {
    this.paymentCancel.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['pattern']) {
        switch (fieldName) {
          case 'cardNumber': return 'Card number must be 16 digits (e.g., 1234 5678 9012 3456)';
          case 'expiryDate': return 'Expiry date must be in MM/YY format';
          case 'cvv': return 'CVV must be 3-4 digits';
          case 'upiId': return 'Please enter a valid UPI ID';
          default: return 'Invalid format';
        }
      }
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.paymentForm.patchValue({ cardNumber: value });
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.patchValue({ expiryDate: value });
  }
}
