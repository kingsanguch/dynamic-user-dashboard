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
  filteredUsers: User[] = [];
  searchTerm: string = '';
  userForm: FormGroup;
  selectedUser: User | null = null;
  modalMode: 'view' | 'edit' = 'view';
  showModal: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder) {
    // Initialize form in the constructor
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }

  deleteUser(id: number): void {
    // For this test, simply remove the user from the local array
    this.users = this.users.filter(u => u.id !== id);
    this.filteredUsers = this.filteredUsers.filter(u => u.id !== id);
  }

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

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  saveUser(): void {
    if (this.userForm.valid && this.selectedUser) {
      this.selectedUser.name = this.userForm.value.name;
      this.selectedUser.email = this.userForm.value.email;
      this.selectedUser.phone = this.userForm.value.phone;
      // Update user in the local array
      this.users = this.users.map(u => u.id === this.selectedUser!.id ? this.selectedUser! : u);
      this.filteredUsers = this.users;
      this.closeModal();
    }
  }
}
