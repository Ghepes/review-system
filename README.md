# review-system
 Review system to Website :  return review to Website page back
 
 Storage: Local storage + MongoDB Storage


 It can be used serverless by using only html js css page that stores data in local Web storage and can be requested through serverless domain trun via Fach requests and pushed into json bucket.
The above implementation was tested by the test: Fech json to mongodb.

This project was transformed from an index.html page serverless Review in vercel app only for mongodb formality.



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

MONGODB_URI=mongodb+srv://example:admin@example.xyz.q1234567x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster

MONGODB_DB=exemple-reviews-db

COLLECTION_NAME=reviews



Demo Pages

Example Product 1 Reviews
Example Product 2 Reviews
API Endpoints
GET /api/reviews?productId=product-1&website=domain.com
GET /api/reviews/stats?productId=product-1&website=domain.com
