export const categories = [{
  id: 1,
  name: "Cars & Vehicles",
  icon: "car",
  fields: [{
    name: "make",
    label: "Make",
    type: "text",
    required: true
  }, {
    name: "model",
    label: "Model",
    type: "text",
    required: true
  }, {
    name: "year",
    label: "Year",
    type: "number",
    required: true
  }, {
    name: "mileage",
    label: "Mileage (km)",
    type: "number",
    required: true
  }, {
    name: "fuelType",
    label: "Fuel Type",
    type: "select",
    options: ["Petrol", "Diesel", "Hybrid", "Electric"],
    required: true
  }, {
    name: "transmission",
    label: "Transmission",
    type: "select",
    options: ["Manual", "Automatic"],
    required: true
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 2,
  name: "Houses & Real Estate",
  icon: "home",
  fields: [{
    name: "propertyType",
    label: "Property Type",
    type: "select",
    options: ["Apartment", "House", "Villa", "Land", "Commercial"],
    required: true
  }, {
    name: "bedrooms",
    label: "Bedrooms",
    type: "number",
    required: true
  }, {
    name: "bathrooms",
    label: "Bathrooms",
    type: "number",
    required: true
  }, {
    name: "size",
    label: "Size (sqm)",
    type: "number",
    required: true
  }, {
    name: "listingType",
    label: "Listing Type",
    type: "select",
    options: ["For Sale", "For Rent"],
    required: true
  }]
}, {
  id: 3,
  name: "Mobile Phones & Tablets",
  icon: "smartphone",
  fields: [{
    name: "brand",
    label: "Brand",
    type: "text",
    required: true
  }, {
    name: "model",
    label: "Model",
    type: "text",
    required: true
  }, {
    name: "storage",
    label: "Storage (GB)",
    type: "select",
    options: ["8", "16", "32", "64", "128", "256", "512", "1TB"],
    required: true
  }, {
    name: "color",
    label: "Color",
    type: "text",
    required: false
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 4,
  name: "PCs & Accessories",
  icon: "laptop",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Laptop", "Desktop", "Monitor", "Printer", "Accessories", "Other"],
    required: true
  }, {
    name: "brand",
    label: "Brand",
    type: "text",
    required: true
  }, {
    name: "processor",
    label: "Processor",
    type: "text",
    required: false
  }, {
    name: "ram",
    label: "RAM (GB)",
    type: "select",
    options: ["2", "4", "8", "16", "32", "64"],
    required: false
  }, {
    name: "storage",
    label: "Storage",
    type: "text",
    required: false
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 5,
  name: "Electronics",
  icon: "tv",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["TV", "Audio", "Camera", "Gaming", "Other"],
    required: true
  }, {
    name: "brand",
    label: "Brand",
    type: "text",
    required: true
  }, {
    name: "model",
    label: "Model",
    type: "text",
    required: false
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 6,
  name: "Home Appliances",
  icon: "refrigerator",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Refrigerator", "Washing Machine", "Air Conditioner", "Cooker", "Microwave", "Other"],
    required: true
  }, {
    name: "brand",
    label: "Brand",
    type: "text",
    required: true
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 7,
  name: "Furniture",
  icon: "armchair",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Sofa", "Bed", "Table", "Chair", "Wardrobe", "Other"],
    required: true
  }, {
    name: "material",
    label: "Material",
    type: "text",
    required: false
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 8,
  name: "Clothing",
  icon: "shirt",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Men", "Women", "Children"],
    required: true
  }, {
    name: "size",
    label: "Size",
    type: "text",
    required: true
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 9,
  name: "Beauty & Care",
  icon: "sparkles",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Skincare", "Makeup", "Hair Care", "Fragrance", "Other"],
    required: true
  }, {
    name: "brand",
    label: "Brand",
    type: "text",
    required: true
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used"],
    required: true
  }]
}, {
  id: 10,
  name: "Fashion",
  icon: "shopping-bag",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Bags", "Shoes", "Watches", "Jewelry", "Accessories", "Other"],
    required: true
  }, {
    name: "brand",
    label: "Brand",
    type: "text",
    required: false
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 11,
  name: "Sports Equipment",
  icon: "dumbbell",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Fitness", "Football", "Basketball", "Running", "Cycling", "Other"],
    required: true
  }, {
    name: "brand",
    label: "Brand",
    type: "text",
    required: false
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 12,
  name: "Animals & Pets",
  icon: "dog",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Dogs", "Cats", "Birds", "Fish", "Other"],
    required: true
  }, {
    name: "breed",
    label: "Breed",
    type: "text",
    required: false
  }, {
    name: "age",
    label: "Age",
    type: "text",
    required: false
  }]
}, {
  id: 13,
  name: "Pet Accessories",
  icon: "bone",
  fields: [{
    name: "type",
    label: "Type",
    type: "select",
    options: ["Food", "Toys", "Beds", "Cages", "Other"],
    required: true
  }, {
    name: "petType",
    label: "For Pet Type",
    type: "select",
    options: ["Dog", "Cat", "Bird", "Fish", "Other"],
    required: true
  }, {
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: true
  }]
}, {
  id: 14,
  name: "Jobs",
  icon: "briefcase",
  fields: [{
    name: "type",
    label: "Job Type",
    type: "select",
    options: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
    required: true
  }, {
    name: "industry",
    label: "Industry",
    type: "text",
    required: true
  }, {
    name: "experience",
    label: "Experience Level",
    type: "select",
    options: ["Entry Level", "Mid Level", "Senior Level", "Manager", "Executive"],
    required: true
  }, {
    name: "education",
    label: "Education",
    type: "select",
    options: ["High School", "Certificate", "Diploma", "Bachelor's Degree", "Master's", "PhD"],
    required: false
  }, {
    name: "salary",
    label: "Salary Range (ETB)",
    type: "text",
    required: false
  }]
}, {
  id: 15,
  name: "Services",
  icon: "wrench",
  fields: [{
    name: "type",
    label: "Service Type",
    type: "select",
    options: ["Home Repair", "Transport", "Beauty", "IT & Tech", "Education", "Health", "Other"],
    required: true
  }, {
    name: "experience",
    label: "Experience (Years)",
    type: "number",
    required: false
  }, {
    name: "availability",
    label: "Availability",
    type: "select",
    options: ["Weekdays", "Weekends", "Evenings", "Full Week"],
    required: true
  }]
}, {
  id: 16,
  name: "Other",
  icon: "more-horizontal",
  fields: [{
    name: "condition",
    label: "Condition",
    type: "select",
    options: ["Brand New", "Used - Like New", "Used - Good", "Used - Fair"],
    required: false
  }]
}];
export const featuredListings = [{
  id: 1,
  title: "Toyota Corolla 2018",
  price: 1250000,
  location: "Addis Ababa",
  category: "Cars & Vehicles",
  image: "https://images.unsplash.com/photo-1616634375264-2d2e17736a36?q=80&w=1000&auto=format&fit=crop",
  isFeatured: true,
  date: "2 days ago"
}, {
  id: 2,
  title: "2 Bedroom Apartment",
  price: 15000,
  location: "Bole, Addis Ababa",
  category: "Houses & Real Estate",
  image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
  isFeatured: true,
  date: "5 hours ago"
}, {
  id: 3,
  title: "iPhone 13 Pro Max",
  price: 65000,
  location: "Mekelle",
  category: "Mobile Phones & Tablets",
  image: "https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?q=80&w=1000&auto=format&fit=crop",
  isFeatured: true,
  date: "1 day ago"
}, {
  id: 4,
  title: "MacBook Pro M1",
  price: 120000,
  location: "Bahir Dar",
  category: "PCs & Accessories",
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
  isFeatured: true,
  date: "3 days ago"
}];
export const onboardingSlides = [{
  id: 1,
  title: "Buy Anything",
  description: "Find and purchase products from trusted sellers across Ethiopia",
  icon: "shopping-cart"
}, {
  id: 2,
  title: "Sell Everything",
  description: "List your items for sale and reach thousands of potential buyers",
  icon: "tag"
}, {
  id: 3,
  title: "Chat Securely",
  description: "Communicate safely with buyers and sellers through our messaging system",
  icon: "message-circle"
}, {
  id: 4,
  title: "Pay Securely",
  description: "Safe and secure payment options for all your transactions",
  icon: "credit-card"
}];