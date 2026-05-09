import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../core/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product|null=null;
  constructor(private route: ActivatedRoute, private ps: ProductService) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('productId'));
    this.loadProducts(id);
  }
   async loadProducts(id: number) {
    this.product = await this.ps.getById(id).toPromise() as Product;
  }
}
