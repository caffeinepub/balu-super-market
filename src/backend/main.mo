import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Product Type
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    description : Text;
    available : Bool;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Product Catalog State
  module ProductCatalog {
    public type State = {
      products : Map.Map<Nat, Product>;
    };

    public func initState() : State {
      let products = Map.empty<Nat, Product>();
      {
        products;
      };
    };

    public func addProduct(state : State, product : Product) {
      state.products.add(product.id, product);
    };

    public func getProduct(state : State, id : Nat) : ?Product {
      state.products.get(id);
    };

    public func updateProduct(state : State, id : Nat, product : Product) {
      state.products.add(id, product);
    };

    public func removeProduct(state : State, id : Nat) {
      state.products.remove(id);
    };

    public func getAllProducts(state : State) : [Product] {
      state.products.values().toArray();
    };

    public func getProductsByCategory(state : State, category : Text) : [Product] {
      let filteredIter = state.products.values().filter(
        func(product) {
          Text.equal(product.category, category);
        }
      );
      filteredIter.toArray();
    };
  };

  // Initialize product catalog state
  let productCatalogState = ProductCatalog.initState();
  let accessControlState = AccessControl.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinAuthorization(accessControlState);

  // Initialize with seed data - Admin only
  public shared ({ caller }) func init() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can initialize the product catalog");
    };

    // Grocery Products
    addSeedProduct(1, "Rice", "Grocery", 60, "Per kg", true);
    addSeedProduct(2, "Wheat Flour", "Grocery", 40, "Per kg", true);
    addSeedProduct(3, "Sugar", "Grocery", 45, "Per kg", true);
    addSeedProduct(4, "Salt", "Grocery", 20, "Per kg", true);
    addSeedProduct(5, "Cooking Oil", "Grocery", 120, "Per litre", true);
    addSeedProduct(6, "Toor Dal", "Grocery", 110, "Per kg", true);
    addSeedProduct(7, "Turmeric Powder", "Grocery", 80, "Per 100g", true);
    addSeedProduct(8, "Red Chilli Powder", "Grocery", 90, "Per 100g", true);
    addSeedProduct(9, "Mustard Seeds", "Grocery", 30, "Per 100g", true);
    addSeedProduct(10, "Basmati Rice", "Grocery", 95, "Per kg", true);

    // Fresh Fruits
    addSeedProduct(11, "Apple", "Fresh Fruits", 180, "Per kg", true);
    addSeedProduct(12, "Banana", "Fresh Fruits", 40, "Per dozen", true);
    addSeedProduct(13, "Mango", "Fresh Fruits", 120, "Per kg", true);
    addSeedProduct(14, "Orange", "Fresh Fruits", 80, "Per kg", true);
    addSeedProduct(15, "Grapes", "Fresh Fruits", 90, "Per kg", true);
    addSeedProduct(16, "Watermelon", "Fresh Fruits", 25, "Per kg", true);
    addSeedProduct(17, "Papaya", "Fresh Fruits", 50, "Per kg", true);
    addSeedProduct(18, "Pomegranate", "Fresh Fruits", 160, "Per kg", true);
    addSeedProduct(41, "Guava", "Fresh Fruits", 60, "Per kg", true);
    addSeedProduct(42, "Pineapple", "Fresh Fruits", 70, "Per piece", true);
    addSeedProduct(43, "Coconut", "Fresh Fruits", 30, "Per piece", true);
    addSeedProduct(44, "Strawberry", "Fresh Fruits", 200, "Per box", true);
    addSeedProduct(45, "Kiwi", "Fresh Fruits", 150, "Per kg", true);

    // Fresh Juice
    addSeedProduct(19, "Orange Juice", "Fresh Juice", 50, "Per glass", true);
    addSeedProduct(20, "Mango Juice", "Fresh Juice", 60, "Per glass", true);
    addSeedProduct(21, "Apple Juice", "Fresh Juice", 55, "Per glass", true);
    addSeedProduct(22, "Lemon Juice", "Fresh Juice", 30, "Per glass", true);
    addSeedProduct(23, "Mixed Fruit Juice", "Fresh Juice", 70, "Per glass", true);
    addSeedProduct(24, "Sugarcane Juice", "Fresh Juice", 25, "Per glass", true);
    addSeedProduct(46, "Pineapple Juice", "Fresh Juice", 55, "Per glass", true);
    addSeedProduct(47, "Watermelon Juice", "Fresh Juice", 40, "Per glass", true);
    addSeedProduct(48, "Coconut Water", "Fresh Juice", 35, "Per glass", true);
    addSeedProduct(49, "Grape Juice", "Fresh Juice", 60, "Per glass", true);

    // Hot Items
    addSeedProduct(25, "Samosa", "Hot Items", 15, "Per piece", true);
    addSeedProduct(26, "Vada", "Hot Items", 10, "Per piece", true);
    addSeedProduct(27, "Bread Roll", "Hot Items", 20, "Per piece", true);
    addSeedProduct(28, "Puff Pastry", "Hot Items", 25, "Per piece", true);
    addSeedProduct(29, "Tea", "Hot Items", 15, "Per cup", true);
    addSeedProduct(30, "Coffee", "Hot Items", 20, "Per cup", true);
    addSeedProduct(31, "Poha", "Hot Items", 40, "Per plate", true);
    addSeedProduct(32, "Upma", "Hot Items", 40, "Per plate", true);
    addSeedProduct(50, "Idli", "Hot Items", 30, "Per plate", true);
    addSeedProduct(51, "Dosa", "Hot Items", 50, "Per plate", true);
    addSeedProduct(52, "Masala Chai", "Hot Items", 20, "Per cup", true);
    addSeedProduct(53, "Bread (Loaf)", "Hot Items", 35, "Per loaf", true);
    addSeedProduct(54, "Biscuits", "Hot Items", 20, "Per pack", true);

    // Cold Items
    addSeedProduct(33, "Vanilla Ice Cream", "Cold Items", 30, "Per cup", true);
    addSeedProduct(34, "Chocolate Ice Cream", "Cold Items", 40, "Per cup", true);
    addSeedProduct(35, "Mango Lassi", "Cold Items", 60, "Per glass", true);
    addSeedProduct(36, "Buttermilk", "Cold Items", 20, "Per glass", true);
    addSeedProduct(37, "Cold Coffee", "Cold Items", 70, "Per glass", true);
    addSeedProduct(38, "Coca Cola", "Cold Items", 40, "Per bottle", true);
    addSeedProduct(39, "Sprite", "Cold Items", 40, "Per bottle", true);
    addSeedProduct(40, "Cold Water", "Cold Items", 20, "Per bottle", true);
    addSeedProduct(55, "Mango Ice Cream", "Cold Items", 40, "Per cup", true);
    addSeedProduct(56, "Strawberry Ice Cream", "Cold Items", 40, "Per cup", true);
    addSeedProduct(57, "Milkshake", "Cold Items", 80, "Per glass", true);
    addSeedProduct(58, "Yogurt", "Cold Items", 30, "Per cup", true);
    addSeedProduct(59, "Fruit Salad", "Cold Items", 60, "Per bowl", true);

    // More Grocery (cutovan)
    addSeedProduct(60, "Milk", "Grocery", 55, "Per litre", true);
    addSeedProduct(61, "Eggs", "Grocery", 80, "Per dozen", true);
    addSeedProduct(62, "Butter", "Grocery", 55, "Per 100g", true);
    addSeedProduct(63, "Honey", "Grocery", 150, "Per bottle", true);
    addSeedProduct(64, "Noodles", "Grocery", 25, "Per pack", true);
    addSeedProduct(65, "Chips", "Grocery", 20, "Per pack", true);
    addSeedProduct(66, "Jam", "Grocery", 90, "Per bottle", true);
  };

  func addSeedProduct(id : Nat, name : Text, category : Text, price : Nat, description : Text, available : Bool) {
    let product : Product = {
      id;
      name;
      category;
      price;
      description;
      available;
    };
    productCatalogState.products.add(id, product);
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Query Functions - Public (no authorization needed)
  public query ({ caller }) func getProducts() : async [Product] {
    productCatalogState.products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filteredIter = productCatalogState.products.values().filter(
      func(product) {
        Text.equal(product.category, category);
      }
    );
    filteredIter.toArray();
  };

  // Admin Functions
  public shared ({ caller }) func updateProductPrice(id : Nat, newPrice : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update product price");
    };
    switch (productCatalogState.products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          category = product.category;
          price = newPrice;
          description = product.description;
          available = product.available;
        };
        productCatalogState.products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func toggleProductAvailability(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can toggle product availability");
    };
    switch (productCatalogState.products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          category = product.category;
          price = product.price;
          description = product.description;
          available = not product.available;
        };
        productCatalogState.products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func addProduct(id : Nat, name : Text, category : Text, price : Nat, description : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add products");
    };
    let product : Product = {
      id;
      name;
      category;
      price;
      description;
      available = true;
    };
    productCatalogState.products.add(id, product);
  };
};
