import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bicycles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bicycles-page fade-in">
      <div class="header-section">
        <div>
          <h1>Fleet Management</h1>
          <p>Add, edit, and monitor your bicycle fleet.</p>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-ghost" (click)="loadBicycles()">
            <span>🔄</span> Refresh
          </button>
          <button class="btn btn-primary" (click)="openModal()">
            <span>➕</span> Add New Bicycle
          </button>
        </div>
      </div>

      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Bicycle Name</th>
                <th>Type</th>
                <th>Price/hr</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bicycles">
                <td>{{ b.name }}</td>
                <td>{{ b.type }}</td>
                <td>Rp {{ b.price_per_hour | number }}</td>
                <td>
                  <span class="badge" [ngClass]="b.is_available ? 'badge-success' : 'badge-danger'">
                    {{ b.is_available ? 'Available' : 'In Use' }}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 8px;">
                    <button *ngIf="!b.is_available" class="btn btn-primary btn-sm" (click)="reactivateBicycle(b.id)" title="Force make available">Reactivate</button>
                    <button class="btn btn-ghost btn-sm" (click)="editBicycle(b)">Edit</button>
                    <button class="btn btn-danger btn-sm" (click)="deleteBicycle(b.id)">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="bicycles.length === 0">
                <td colspan="5" class="empty-state">
                  <div class="icon">🚲</div>
                  <p>No bicycles found. Add your first bicycle to get started!</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal-box">
          <h2 class="modal-title">{{ editingId ? 'Edit' : 'Add' }} Bicycle</h2>
          
          <form (ngSubmit)="saveBicycle()">
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label">Bicycle Name</label>
              <input type="text" class="form-control" name="name" [(ngModel)]="currentBicycle.name" placeholder="e.g. Polygon Xtrada" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label">Type</label>
                <select class="form-control" name="type" [(ngModel)]="currentBicycle.type">
                  <option value="MTB">MTB</option>
                  <option value="Road">Road</option>
                  <option value="Folding">Folding</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Price / Hour</label>
                <input type="number" class="form-control" name="price" [(ngModel)]="currentBicycle.price_per_hour" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label">Latitude</label>
                <input type="number" step="0.000001" class="form-control" name="lat" [(ngModel)]="currentBicycle.last_lat">
              </div>
              <div class="form-group">
                <label class="form-label">Longitude</label>
                <input type="number" step="0.000001" class="form-control" name="long" [(ngModel)]="currentBicycle.last_long">
              </div>
            </div>

            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" name="is_available" [(ngModel)]="currentBicycle.is_available">
                <span class="form-label">Available for rent</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .header-section h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .header-section p { color: var(--text-secondary); }
  `]
})
export class BicyclesPageComponent implements OnInit {
  bicycles: any[] = [];
  showModal = false;
  editingId: string | null = null;
  currentBicycle: any = {
    name: '',
    type: 'MTB',
    price_per_hour: 10000,
    is_available: true,
    last_lat: -6.200000,
    last_long: 106.816666
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBicycles();
  }

  loadBicycles() {
    this.api.getBicycles().subscribe(res => this.bicycles = res);
  }

  openModal() {
    this.editingId = null;
    this.currentBicycle = {
      name: '',
      type: 'MTB',
      price_per_hour: 10000,
      is_available: true,
      last_lat: -6.200000,
      last_long: 106.816666
    };
    this.showModal = true;
  }

  editBicycle(b: any) {
    this.editingId = b.id;
    this.currentBicycle = { ...b };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveBicycle() {
    if (this.editingId) {
      this.api.updateBicycle(this.editingId, this.currentBicycle).subscribe({
        next: () => {
          alert('Bicycle updated successfully!');
          this.loadBicycles();
          this.closeModal();
        },
        error: (err) => alert('Error updating bicycle: ' + (err.error?.message || err.message))
      });
    } else {
      this.api.createBicycle(this.currentBicycle).subscribe({
        next: () => {
          alert('Bicycle added successfully!');
          this.loadBicycles();
          this.closeModal();
        },
        error: (err) => alert('Error adding bicycle: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteBicycle(id: string) {
    if (confirm('Are you sure you want to delete this bicycle?')) {
      this.api.deleteBicycle(id).subscribe(() => this.loadBicycles());
    }
  }

  reactivateBicycle(id: string) {
    if (confirm('Force reactivate this bicycle? This will end any active booking.')) {
      this.api.reactivateBicycle(id).subscribe({
        next: () => {
          this.loadBicycles();
        },
        error: (err) => alert('Error reactivating bicycle: ' + (err.error?.message || err.message))
      });
    }
  }
}
