import { Component, computed, effect, inject, linkedSignal, RESPONSE_INIT, signal } from "@angular/core";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";
import { DEFAULT_SETTINGS } from "./constants/defautl-setting";
import { rxResource } from "@angular/core/rxjs-interop";
import { ProductApiResponse } from "./dto/product-api-response.dto";
import { BehaviorSubject, concatMap, finalize, scan, takeWhile, tap } from "rxjs";
import { API } from "src/config/api.config";

const DEFAUT_SETTINGS: Settings = {
  limit: 12,
  skip: 0,
};

const DEFAULT_PRODUCT_API_RESPONSE : ProductApiResponse = {
  products: [],
  total: 0,
  skip:0,
  limit:0
}

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"],
    standalone: true,
    imports: [],
})
export class ProductsComponent {

  private productService = inject(ProductService);

  readonly settings$: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(
    DEFAUT_SETTINGS
  );
  
  isloadingNewProduct = signal(0);

  productResource = rxResource<ProductApiResponse, Settings>({
    loader: () => this.settings$.pipe(
            tap(() => this.isloadingNewProduct.update(n => n+1)), //code imperatif
            concatMap((settings) => this.productService.getProducts(settings)
            .pipe(
              finalize(() => this.isloadingNewProduct.update(n => n-1)) //code imperatif
            )
            ),
            scan ((allResponses, newResponse) => {
                const combinedProducts = [...newResponse.products,...allResponses.products ];
                return {
                    ...newResponse,
                    products: combinedProducts
                };
              }
            ),
            tap((response) => {
              console.log("all products length :", response.products.length)
              console.log("total products available:", response.total)
              })
            ,
            finalize(() => this.isloadingNewProduct.set(0)), //code imperatif
            takeWhile((response) => response.products.length < response.total , true),
        ),
    defaultValue: DEFAULT_PRODUCT_API_RESPONSE
  });
   


  totalProducts = computed(() => this.productResource.value()?.total);

  products = computed(() => this.productResource.value()?.products);

  hasMoreProducts = computed(() => this.products().length < this.totalProducts());

  loadMore() {
      this.settings$.next({
        limit : this.settings$.value.limit,
        skip: this.settings$.value.skip + this.settings$.value.limit,
      });
  }

   constructor() {
    effect(() => {
      console.log('=== important  Status ===');
      console.log('Current Settings:', this.settings$.value);
      console.log('isLoading:', this.productResource.isLoading());
      console.log('hasValue:', this.productResource.hasValue());
      console.log('value:', this.productResource.value());
      console.log('error:', this.productResource.error());
      console.log('status:', this.productResource.status());
      console.log('totalProducts :', this.totalProducts());
      console.log('length of products :', this.products().length);
      console.log('hasMoreProducts :', this.hasMoreProducts());
      console.log('products:', this.products());
      console.log('**==============================**');
    });
  }
  
}

