import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    console.log("Auth callback received:", req.body); 
    const { id, firstName, lastName, imageUrl } = req.body;
    
    console.log("Looking for user with clerkId:", id);
    const user = await User.findOne({ clerkId: id });
    console.log("Found existing user:", user);
    
    if (!user) {
      console.log("Creating new user...");
      const newUser = await User.create({
        clerkId: id, 
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
      });
      console.log("New user created successfully:", newUser);
    } else {
      console.log("User already exists, skipping creation");
    }

    res.status(200).json({success:true});
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
}
