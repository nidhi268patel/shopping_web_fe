import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/product.service';

@Component({
  selector: 'admin-product-details',
  templateUrl: './admin-product-details.component.html',
  styleUrls: ['./admin-product-details.component.css']
})
export class AdminProductDetailsComponent implements OnInit {

 products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  loading = false;

  // Modal States
  showAddModal = false;
  showEditModal = false;
  selectedProduct: Product | null = null;
  
  // Add/Edit Form
  formData: any = {
    productName: '',
    productDescription: '',
    sellingPrice: 0,
    mrpPrice: 0,
    discountPercent: 0,
    availableStock: 0,
    productCategory: ''
  };

  private apiUrl = 'http://localhost:8080/api/products';
  defaultImage = 'https://via.placeholder.com/50x50/f8f9fa/6c757d?text=?';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('AdminProductDetailsComponent initialized');
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    try {
      const response: any[] = await this.http.get<any[]>(this.apiUrl).toPromise() || [];
      this.products = response.map(p => ({
        ...p,
        imageBase64: p.imageBase64 || this.defaultImage
      }));
      this.filterProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.selectedCategory || product.productCategory === this.selectedCategory)
    );
  }

  // ADD MODAL
  openAddModal() {
    this.formData = {
      productName: '',
      productDescription: '',
      sellingPrice: 0,
      mrpPrice: 0,
      discountPercent: 0,
      availableStock: 0,
      productCategory: 'Others'
    };
    this.showAddModal = true;
  }

  // EDIT MODAL
  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.formData = { ...product };
    this.previewImage = product.imageBase64 || null;
    this.showEditModal = true;
  }

  async saveProduct() {
     if (!this.formData.productName || !this.formData.sellingPrice || this.formData.sellingPrice > this.formData.mrpPrice) {
      alert('Please fill required fields and ensure selling price ≤ MRP');
      return;
    }
    try {
      if (this.showAddModal) {
        await this.http.post(this.apiUrl, this.formData).toPromise();
        alert('✅ Product created!');
      } else if (this.showEditModal) {
        await this.http.put(`${this.apiUrl}/${this.formData.productId}`, this.formData).toPromise();
        alert('✅ Product updated!');
      }
      this.closeModals();
      this.loadProducts();
    } catch (error) {
      alert('❌ Save failed');
    }
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedProduct = null;
  }

  async deleteProduct(id: number) {
    if (confirm('Delete this product?')) {
      try {
        await this.http.delete(`${this.apiUrl}/${id}`).toPromise();
        this.loadProducts();
        alert('🗑️ Product deleted!');
      } catch (error) {
        alert('❌ Delete failed');
      }
    }
  }

  trackByProductId(index: number, product: Product): any {
    return product.productId;
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-low';
    if (stock < 10) return 'stock-low';
    if (stock < 50) return 'stock-medium';
    return 'stock-high';
  }
   // File Upload Handler
   // Image Preview & File
  previewImage: string | null = null;
  selectedFile: File | null = null;
 async onFileSelect(event: any) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    this.selectedFile = file;
    this.formData.imageContentType = file.type;
    
    // ✅ Convert to Base64 WITHOUT data URL prefix for backend
    const base64 = await this.fileToBase64(file);
    this.previewImage = base64;  // Full data URL for preview
    
    // ✅ CLEAN BASE64 for backend (remove "data:image/...;base64," prefix)
    const cleanBase64 = base64.split(',')[1];
    this.formData.productImageData = cleanBase64;
  } else {
    alert('Please select a valid image file');
    this.clearImage();
  }
}

private fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);  // Full data URL for preview
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

clearImage() {
  this.selectedFile = null;
  this.previewImage = null;
  this.formData.imageContentType = '';
  this.formData.productImageData = '';
}
 updateDiscount() {
    if (this.formData.mrpPrice > 0 && this.formData.sellingPrice >= 0) {
      const discount = Math.round(
        ((this.formData.mrpPrice - this.formData.sellingPrice) / this.formData.mrpPrice) * 100
      );
      this.formData.discountPercent = Math.max(0, discount);
    }
  }

}
