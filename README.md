# review-system
 review system form marketplace

 install:
 ```
 pnpm install
 ```

 Run test Dev:
 ```
 pnpm run dev
 ```

 Build app:
 ```
 pnpm build
 ```


 Set: const website = "domain.com"


Set .ENV mongoDB:
MONGODB_URI=mongodb+srv://xxxxxxxx:xxxxxxxxx@xxxxxxxxxx.q00000x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster
MONGODB_DB=exemple-reviews-db
COLLECTION_NAME=reviews



Demo Pages
Example Product 1 Reviews
Example Product 2 Reviews
API Endpoints
GET /api/reviews?productId=product-1&website=domain.com
GET /api/reviews/stats?productId=product-1&website=domain.com