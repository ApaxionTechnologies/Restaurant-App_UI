import Restaurant from "../models/Restaurant.js";

// 🟢 Add Menu Item (already implemented)
export const addMenuItem = async (req, res) => {
  try {
    const { restaurantEmail, name, price, category, timeToPrepare } = req.body;

    const restaurant = await Restaurant.findOne({ email: restaurantEmail });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.menu.push({
      name,
      price,
      category,
      prepTime: timeToPrepare,
    });

    await restaurant.save();
    res.status(200).json({ message: "Menu item added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Get Menu by Restaurant Name
export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantName } = req.params;

    const restaurant = await Restaurant.findOne({ restaurantName });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant.menu);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
