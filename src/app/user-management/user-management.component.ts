import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  userForm: FormGroup;
  selectedUser: User | null = null;
  modalMode: 'view' | 'edit' = 'view';
  showModal: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder) {
    // Form for editing a user
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load local JSON data
    this.userService.loadUsers();

    // Subscribe to the user list for real-time updates
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
  }

  // Filter users by name/email    
  filterUsers(): User[] {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u =>
      u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }

  // Delete user
  deleteUser(id: number): void {
    this.userService.deleteUser(id);
  }

  // Open the modal in "view" or "edit" mode
  openModal(user: User, mode: 'view' | 'edit'): void {
    this.selectedUser = { ...user };
    this.modalMode = mode;

    if (mode === 'edit') {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  // Save user after editing
  saveUser(): void {
    if (this.userForm.valid && this.selectedUser) {
      const updatedUser: User = {
        ...this.selectedUser,
        ...this.userForm.value
      };
      this.userService.updateUser(updatedUser);
      this.closeModal();
    }
  }
}
