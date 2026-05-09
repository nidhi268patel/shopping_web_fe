import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressService } from 'src/app/core/address.service';
import { Address } from 'src/app/core/constant';
import { UserService } from 'src/app/core/user.service';


@Component({
    selector: 'app-address-form-modal',
    templateUrl: './address-form-modal.component.html',
    styleUrls: ['./address-form-modal.component.scss']
})
export class AddressFormModalComponent implements OnInit {
    @Input() address: Address | null = null;
    @Output() save = new EventEmitter<Address>();
    @Output() close = new EventEmitter<void>();

    addressForm!: FormGroup;
    isEditing = false;

    constructor(private fb: FormBuilder, private userService: UserService, private addressService: AddressService

    ) {
        this.addressForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
            mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            type: ['', Validators.required]
        });
    }
    usersDetails: any;
    ngOnInit() {
        this.usersDetails = this.userService.getUser();
        if (this.address) {
            this.isEditing = true;
            this.addressForm.patchValue(this.address);
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.addressForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    saveAddress() {
        console.log("usersDetails from service:", this.usersDetails);

        if (this.addressForm.valid) {
            const formValue = this.addressForm.value;
            let addressData: Address = {
                ...formValue,
                id: this.address?.id || null,
                userId: this.usersDetails?.id || null
            };


            this.addressService.addAddress(addressData).subscribe(savedAddress => {
                this.save.emit(savedAddress);
            }, error => {
                console.error('Error saving address:', error);
            });
        }
    }

    closeModal() {
        this.close.emit();
    }
}
