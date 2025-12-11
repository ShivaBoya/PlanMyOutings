// Restaurants.jsx
import React, { useEffect, useState } from "react";

// 30 restaurant dataset
const restaurantData = [
  { id:1, name:"The Spice House", cuisine:"Indian", rating:4.6, location:"Mumbai", description:"Homestyle Indian curries and breads, rich flavors.", image:"https://source.unsplash.com/800x600/?indian-food&sig=1" },
  { id:2, name:"Pasta Paradise", cuisine:"Italian", rating:4.4, location:"Delhi", description:"Handmade pastas and seasonal sauces.", image:"https://source.unsplash.com/800x600/?pasta&sig=2" },
  { id:3, name:"Sushi World", cuisine:"Japanese", rating:4.8, location:"Bangalore", description:"Fresh nigiri and omakase-style tasting menus.", image:"https://source.unsplash.com/800x600/?sushi&sig=3" },
  { id:4, name:"Burger Barn", cuisine:"American", rating:4.1, location:"Chennai", description:"Juicy patties, house-made sauces and fries.", image:"https://source.unsplash.com/800x600/?burger&sig=4" },
  { id:5, name:"Taco Town", cuisine:"Mexican", rating:4.3, location:"Pune", description:"Street-style tacos with fresh salsas.", image:"https://source.unsplash.com/800x600/?tacos&sig=5" },
  { id:6, name:"Curry Kingdom", cuisine:"Indian", rating:4.5, location:"Kolkata", description:"Regional curries from around India.", image:"https://source.unsplash.com/800x600/?curry&sig=6" },
  { id:7, name:"Dragon Wok", cuisine:"Chinese", rating:4.4, location:"Hyderabad", description:"Stir-fries, dim sum and classic Cantonese.", image:"https://source.unsplash.com/800x600/?chinese-food&sig=7" },
  { id:8, name:"Pizza Planet", cuisine:"Italian", rating:4.2, location:"Mumbai", description:"Wood-fired pizzas with creative toppings.", image:"https://source.unsplash.com/800x600/?pizza&sig=8" },
  { id:9, name:"Ramen House", cuisine:"Japanese", rating:4.7, location:"Bangalore", description:"Slow-simmered broths and springy noodles.", image:"https://source.unsplash.com/800x600/?ramen&sig=9" },
  { id:10, name:"Steak Station", cuisine:"American", rating:4.6, location:"Delhi", description:"Premium steaks, dry-aged cuts and sides.", image:"https://source.unsplash.com/800x600/?steak&sig=10" },
  { id:11, name:"Samosa Street", cuisine:"Indian", rating:4.0, location:"Pune", description:"Quick bites and chaats, local favorite.", image:"https://source.unsplash.com/800x600/?street-food&sig=11" },
  { id:12, name:"La Baguette", cuisine:"French", rating:4.3, location:"Chennai", description:"Bakery and bistro with pastries and mains.", image:"https://source.unsplash.com/800x600/?french-food&sig=12" },
  { id:13, name:"Burrito Bros", cuisine:"Mexican", rating:4.1, location:"Kolkata", description:"Big burritos, fresh fillings, guac galore.", image:"https://source.unsplash.com/800x600/?burrito&sig=13" },
  { id:14, name:"Noodle Nook", cuisine:"Chinese", rating:4.0, location:"Hyderabad", description:"Comfort noodle bowls and small plates.", image:"https://source.unsplash.com/800x600/?noodles&sig=14" },
  { id:15, name:"Gelato Galore", cuisine:"Dessert", rating:4.6, location:"Mumbai", description:"Creamy gelato and sorbets, daily flavors.", image:"https://source.unsplash.com/800x600/?gelato&sig=15" },
  { id:16, name:"Curry Corner", cuisine:"Indian", rating:4.4, location:"Delhi", description:"Family recipes and slow-cooked delights.", image:"https://source.unsplash.com/800x600/?indian-curry&sig=16" },
  { id:17, name:"Sushi Spot", cuisine:"Japanese", rating:4.7, location:"Bangalore", description:"Nigiri, rolls and seasonal specialities.", image:"https://source.unsplash.com/800x600/?sushi-roll&sig=17" },
  { id:18, name:"Burger Bistro", cuisine:"American", rating:4.2, location:"Chennai", description:"Casual burgers with gourmet twists.", image:"https://source.unsplash.com/800x600/?gourmet-burger&sig=18" },
  { id:19, name:"Taco Temple", cuisine:"Mexican", rating:4.3, location:"Pune", description:"Authentic corn tortillas and grilled fillings.", image:"https://source.unsplash.com/800x600/?authentic-mexican-food&sig=19" },
  { id:20, name:"Wok Way", cuisine:"Chinese", rating:4.5, location:"Kolkata", description:"Woks fired up for aromatic stir-fries.", image:"https://source.unsplash.com/800x600/?wok&sig=20" },
  { id:21, name:"Pasta Point", cuisine:"Italian", rating:4.4, location:"Hyderabad", description:"Classic pastas and house-made sauces.", image:"https://source.unsplash.com/800x600/?italian-pasta&sig=21" },
  { id:22, name:"Curry Club", cuisine:"Indian", rating:4.3, location:"Mumbai", description:"Popular spot for rich gravies and breads.", image:"https://source.unsplash.com/800x600/?indian-restaurant-interior&sig=22" },
  { id:23, name:"Sushi Supreme", cuisine:"Japanese", rating:4.8, location:"Delhi", description:"Top-tier fish and precision slicing.", image:"https://source.unsplash.com/800x600/?japanese-restaurant&sig=23" },
  { id:24, name:"Steakhouse Central", cuisine:"American", rating:4.6, location:"Bangalore", description:"Classic steakhouse with robust sides.", image:"https://source.unsplash.com/800x600/?steakhouse&sig=24" },
  { id:25, name:"Burrito Boulevard", cuisine:"Mexican", rating:4.1, location:"Chennai", description:"Fast, flavorful burritos and bowls.", image:"https://source.unsplash.com/800x600/?mexican-bowl&sig=25" },
  { id:26, name:"Dragon Delight", cuisine:"Chinese", rating:4.5, location:"Pune", description:"Family-friendly Chinese favorites.", image:"https://source.unsplash.com/800x600/?chinese-noodles&sig=26" },
  { id:27, name:"La Dolce Pizza", cuisine:"Italian", rating:4.7, location:"Kolkata", description:"Sicilian and Neapolitan-style pizzas.", image:"https://source.unsplash.com/800x600/?neapolitan-pizza&sig=27" },
  { id:28, name:"Curry Cafe", cuisine:"Indian", rating:4.4, location:"Hyderabad", description:"Cafe-style Indian fusion and snacks.", image:"https://source.unsplash.com/800x600/?fusion-food&sig=28" },
  { id:29, name:"Ramen Realm", cuisine:"Japanese", rating:4.6, location:"Mumbai", description:"Hearty ramen bowls with slow broths.", image:"https://source.unsplash.com/800x600/?ramen-bowl&sig=29" },
  { id:30, name:"Burger Bay", cuisine:"American", rating:4.3, location:"Delhi", description:"Classic and chicken burger varieties.", image:"https://source.unsplash.com/800x600/?burger-restaurant&sig=30" }
];

export default function Restaurants({ darkMode }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setRestaurants(restaurantData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p className="p-6 text-center">Loading restaurants...</p>;

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Explore Restaurants 🍽️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map((r) => (
          <div
            key={r.id}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl`}
          >
            <img src={r.image} alt={r.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col justify-between h-56">
              <div>
                <h3 className="text-lg md:text-xl font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">{r.cuisine} • {r.location}</p>
                <p className="mt-2 text-gray-700 dark:text-gray-200 text-sm line-clamp-3">{r.description}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">★ {r.rating}</span>
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
