package com.queen.mobiles.admin.lib.product;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.queen.mobiles.admin.lib.common.APIResponse;
import com.queen.mobiles.admin.lib.common.Image;
import com.queen.mobiles.admin.lib.util.Utils;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @Value("${product.page-size}")
    private int DEFAULT_FETCH_LIMIT;

    @PostMapping("/list")
    public ResponseEntity<APIResponse> signup(@RequestBody ProductSearchRequest productRequest) {
        try {
            List<Product> products = this.productService.getProducts(productRequest);

            int totalProducts = this.productService.getTotalProducts();

            Map<String, Object> data = new HashMap<>();
            data.put("products", products);
            data.put("totalProducts", totalProducts);
            data.put("pageSize", DEFAULT_FETCH_LIMIT);

            APIResponse response = APIResponse.builder()
                    .code(HttpStatus.OK.value())
                    .status("success")
                    .data(data)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Throwable err) {
            return Utils.getResponseFromError(err);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<APIResponse> signup(@PathVariable String productId) {
        try {
            Product product = this.productService.getProduct(productId);

            Map<String, Object> data = new HashMap<>();
            data.put("product", product);

            APIResponse response = APIResponse.builder()
                    .code(HttpStatus.OK.value())
                    .status("success")
                    .data(data)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Throwable err) {
            return Utils.getResponseFromError(err);
        }
    }

    @GetMapping("product/image/{id}")
    public ResponseEntity<InputStreamResource> listCarousels(
            @PathVariable String id, HttpServletRequest request, HttpServletResponse response) {
        Image image = this.productService.getProductImage(id);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(image.getData()));

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, image.getMime());

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(image.getData().length)
                .body(resource);
    }
}
