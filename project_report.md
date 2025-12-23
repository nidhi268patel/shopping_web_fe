
# **Project Report: Shopping Angular**

---

## **CHAPTER 1: INTRODUCTION**

### **1.1 Project Overview**
This project is a modern, single-page e-commerce web application developed using the Angular framework. It serves as a client-side frontend for an online store, providing a seamless and interactive user experience for browsing products, managing a shopping cart, and proceeding to checkout. The application communicates with a backend server via a RESTful API to fetch and manage product data.

### **1.2 Problem Statement**
The goal is to create a responsive, user-friendly, and efficient online shopping platform. Traditional multi-page web applications can feel slow and clunky. This project aims to solve that by leveraging the power of a modern JavaScript framework (Angular) to build a fast, dynamic, and maintainable Single-Page Application (SPA) that provides a superior user experience compared to classic e-commerce websites.

### **1.3 Objectives of the Project**
*   To develop a fully functional client-side e-commerce application.
*   To create a clear and intuitive user interface for browsing and purchasing products.
*   To implement core e-commerce functionalities: product listing, product details, shopping cart, and a checkout process.
*   To build a modular and scalable codebase using Angular's component-based architecture.
*   To ensure the application is responsive and works well on various screen sizes.
*   To implement a client-side cart that persists across browser sessions.
*   To create an administrative interface for managing product details.

### **1.4 Scope of the Project**
The project scope is focused on the frontend implementation of an e-commerce system. This includes:
*   **User-facing features:** Product catalog, product detail view, shopping cart, and a checkout form.
*   **Admin features:** A view for administrators to see product details (and implicitly, manage them via API calls).
*   **Data Handling:** Interaction with a backend API for all product-related data.
*   **State Management:** Client-side management of the shopping cart state.
*   **Out of Scope:** The project does not include the development of the backend server or database, payment gateway integration, user authentication, or order fulfillment systems. It assumes a pre-existing REST API for products.

### **1.5 Software and Hardware Requirements**
#### **1.5.1 Software Requirements**
*   **Operating System:** Windows, macOS, or Linux.
*   **Web Browser:** A modern browser like Google Chrome, Firefox, or Microsoft Edge.
*   **Runtime Environment:** Node.js.
*   **Framework:** Angular CLI and framework.
*   **Development Tools:** A code editor like VS Code.

#### **1.5.2 Hardware Requirements**
*   Any standard desktop or laptop computer capable of running a modern web browser and Node.js.

### **1.6 Functional and Non-Functional Requirements**
*   **Functional:**
    *   Users can view a list of all products.
    *   Users can click on a product to view its detailed description.
    *   Users can add products to a shopping cart.
    *   Users can view and modify the contents of their cart.
    *   Users can proceed to a checkout page and fill in their details.
    *   An admin user can view and manage products.
*   **Non-Functional:**
    *   The application should be fast and responsive.
    *   The UI should be intuitive and easy to navigate.
    *   The cart state should be preserved even if the user closes the browser tab.

---

## **CHAPTER 2: LITERATURE SURVEY**

### **2.1 Existing Systems and Related Work**
Many e-commerce platforms exist, from large-scale systems like Amazon and eBay to smaller sites built with Shopify or Magento. Technologically, these are built on a variety of stacks. This project draws inspiration from the modern SPA approach seen in the frontend of many leading e-commerce sites, which use frameworks like React, Vue, or, in this case, Angular to create a fluid user experience without constant page reloads.

### **2.2 Limitations in Existing Systems**
Traditional, server-rendered e-commerce sites often suffer from higher latency as every user action requires a full page reload from the server. This can lead to a disjointed user experience. While many modern systems have adopted SPA principles, simpler implementations may lose cart state on refresh or fail to provide a clean separation between frontend and backend logic.

### **2.3 Overview of Technologies Used**
*   **Angular:** A powerful, component-based TypeScript framework for building scalable web applications. It provides a structured architecture, dependency injection, and a rich ecosystem of tools.
*   **TypeScript:** A statically-typed superset of JavaScript that enhances code quality and maintainability.
*   **RxJS:** A library for reactive programming using Observables, used extensively in Angular for handling asynchronous operations like HTTP requests and event handling.
*   **Bootstrap:** A popular CSS framework for building responsive, mobile-first websites with pre-built components and a powerful grid system.
*   **HTML5 & SCSS:** The standard for structuring web content, with SCSS used as a CSS pre-processor for more organized and powerful styling.

---

## **CHAPTER 3: SYSTEM ANALYSIS & METHODOLOGY**

### **3.1 Existing System**
The project assumes a "greenfield" scenario where no prior frontend system existed. The alternative would be a traditional, server-side rendered application where the frontend and backend are tightly coupled, leading to the limitations described in section 2.2.

### **3.2 Proposed System**
#### **3.2.1 System Overview**
The proposed system is a Single-Page Application (SPA) built with Angular. It acts as a pure client to a separate backend server. The application loads once, and then all subsequent navigation and interactions are handled dynamically on the client-side, with data being fetched asynchronously from the backend API as needed. This results in a much faster and smoother user experience.

#### **3.2.2 Key Features and Functionalities**
*   **Product Catalog:** Displays products fetched from the backend.
*   **Product Detail View:** A dedicated page for a single product's information.
*   **Persistent Shopping Cart:** A client-side cart that uses `localStorage` to save its state, allowing it to persist across browser sessions. The cart's state is managed reactively using RxJS.
*   **REST API Integration:** All product data is managed through HTTP calls to a backend service, ensuring a clean separation of concerns.
*   **Component-Based Architecture:** The UI is broken down into reusable and manageable components (e.g., Shop, Cart, Product Detail).

### **3.3 Feasibility Study**
*   **Technical Feasibility:** The use of Angular, a mature and well-documented framework, makes the project technically feasible. The requirements are well within the capabilities of the chosen technology stack.
*   **Economic Feasibility:** As an open-source stack (Angular, Node.js), the software costs are negligible. The main cost is development time. Given the well-defined scope, it is economically viable.
*   **Operational Feasibility:** The application is easy to deploy and operate on any standard web server. Users only need a modern web browser, making it highly accessible.

---

## **CHAPTER 4: SYSTEM DESIGN**

### **4.1 System Architecture**
The application follows a client-server architecture. The Angular frontend is the client, and it communicates with a backend (assumed to be running on `localhost:8080`) over HTTP. The frontend itself is designed using a **Component-Based Architecture**.

### **4.2 Detailed Design**
*   **Use Case Diagrams:**
    *   A `User` can: View Products, View Product Details, Add to Cart, View Cart, Checkout.
    *   An `Admin` can: Manage Products.
*   **Activity Diagrams:**
    *   **Shopping:** User navigates to shop page -> Products are loaded -> User clicks a product -> Navigates to product detail -> User clicks "Add to Cart" -> Cart is updated.
    *   **Checkout:** User navigates to cart -> Clicks "Checkout" -> Fills out form -> Submits order.

### **4.3 Database Design**
The database design is handled by the backend. However, the frontend consumes a `Product` model with the following schema:
```typescript
export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  sellingPrice: number;
  mrpPrice: number;
  discountPercent: number;
  availableStock: number;
  productCategory: string;
  imageContentType: string;
  productImageData: Uint8Array;
  imageBase64: string;
}
```
The cart data is stored client-side in `localStorage` as a JSON array of `CartItem` objects.

### **4.4 User Interface Design**
The UI is designed to be clean, modern, and responsive, utilizing the Bootstrap framework for its grid system and styled components. The main navigation allows users to move between the shop and cart pages.

### **4.5 Module Description**
*   **Core Services:**
    *   `ProductService`: Handles all HTTP communication with the `/api/products` endpoint for CRUD operations.
    *   `CartService`: Manages the state of the shopping cart entirely on the client-side. It uses RxJS and `localStorage` to provide a reactive and persistent cart.
*   **Page Components:**
    *   `ShopComponent`: The main landing page, displays all products.
    *   `ProductDetailComponent`: Displays detailed information for a single product.
    *   `CartComponent`: Displays the items in the cart and the total price.
    *   `CheckoutComponent`: Provides a form for the user to finalize their purchase.
    *   `AdminProductDetailsComponent`: A page for product management.

---

## **CHAPTER 5: IMPLEMENTATION & RESULTS**

### **5.1 Implementation Environment**
*   **Programming Language:** TypeScript
*   **Framework:** Angular (~14.2.12)
*   **Styling:** Bootstrap, SCSS
*   **Tools:** Angular CLI, Node.js

### **5.2 Implementation of Modules**
*   **`ProductService`:** Implemented using Angular's `HttpClient` to make GET, POST, PUT, and DELETE requests to the backend API. It returns RxJS `Observable` objects.
*   **`CartService`:** Implemented with an RxJS `BehaviorSubject` to hold the array of cart items. On initialization, it loads data from `localStorage`. Any modification to the cart (add, remove, clear) updates the internal array and then calls a private `save()` method, which persists the new state to `localStorage` and pushes the new array to the `BehaviorSubject` stream.
*   **Components:** The page components subscribe to the `Observable` streams provided by the services to get their data. For example, the `CartComponent` subscribes to `cartService.observeCart()` to automatically re-render whenever the cart changes.

### **5.3 Output & Results**
The result is a fully functional e-commerce frontend. Users can browse, add items to their cart, and see the total update in real-time. The cart's contents remain even if the page is reloaded, providing a robust user experience. The separation from the backend means the UI remains fast and responsive at all times.

---

## **CHAPTER 6: TESTING**

### **6.1 Testing Strategies**
The project is set up with the standard Angular testing structure.
*   **Unit Testing:** Using Jasmine and Karma to test individual components and services in isolation. For example, a unit test for `CartService` would check if adding an item correctly updates the cart's total and if `localStorage` is being called.
*   **Integration Testing:** Testing how components interact with each other and with services. For example, testing that when the "Add to Cart" button in `ProductDetailComponent` is clicked, the `CartComponent` view updates accordingly.
*   **System Testing (E2E):** Using a framework like Protractor or Cypress (though not specified in `package.json`) to run end-to-end tests that simulate a real user's workflow in a browser.

### **6.2 Test Cases**
*   **Unit Test for `CartService.addToCart`:**
    *   **Given:** The cart is empty.
    *   **When:** `addToCart()` is called with a new item.
    *   **Then:** The cart should contain one item and the total should be correct.
*   **Integration Test for Product Page:**
    *   **Given:** The user is on the shop page.
    *   **When:** The user clicks on a product image.
    *   **Then:** The router should navigate to `/product/:id` and the `ProductDetailComponent` should display the correct product's information.

---

## **CHAPTER 7: CONCLUSION AND FUTURE ENHANCEMENTS**

### **7.1 Conclusion**
This project successfully demonstrates the development of a modern, client-side e-commerce application using Angular. By separating the frontend from the backend and leveraging a powerful framework, the application achieves a high level of performance and user experience. The implementation of a persistent, reactive shopping cart provides a core feature essential for any online store.

### **7.2 Limitations**
*   The application is purely a frontend and is dependent on a running backend API.
*   There is no user authentication or authorization system.
*   The checkout process is a simulation and does not integrate with a real payment gateway.

### **7.3 Future Enhancements**
*   **User Authentication:** Implement user login and registration to allow for personalized experiences and order history.
*   **Payment Gateway Integration:** Integrate a service like Stripe or PayPal to handle real payments.
*   **Backend Development:** Build out the corresponding backend application and database.
*   **State Management Library:** For more complex applications, integrate a dedicated state management library like NgRx or Akita.
*   **Advanced Features:** Add product reviews, wishlists, and more advanced product filtering and sorting.
