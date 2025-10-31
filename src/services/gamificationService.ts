import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * 🎯 Centralized gamification updater
 * Handles points & badges for owners/renters after each action
 */
export const updateGamification = async (
  userEmail: string,
  role: "owner" | "renter",
  action: string
) => {
  try {
    const userRef = doc(db, "users", userEmail);
    const snap = await getDoc(userRef);
    const data = snap.data() || {};

    const pointsField = role === "owner" ? "ownerPoints" : "renterPoints";
    let incrementValue = 0;

    // 🧮 point logic
    switch (action) {
      case "rent_success": // renter completes rental
        incrementValue = 25;
        data.successfulRentals = (data.successfulRentals || 0) + 1;
        break;
      case "leave_review_renter":
        incrementValue = 5;
        data.reviewsWritten = (data.reviewsWritten || 0) + 1;
        break;
      case "receive_positive_review":
        incrementValue = 10;
        break;
      case "list_item":
        incrementValue = 10;
        break;
      case "approve_rental":
        incrementValue = 20;
        break;
      case "complete_rental":
        incrementValue = 30;
        data.successfulRentals = (data.successfulRentals || 0) + 1;
        break;
      case "leave_review_owner":
        incrementValue = 5;
        break;
      default:
        incrementValue = 0;
    }

    // 🪙 update points
    await updateDoc(userRef, {
      [pointsField]: increment(incrementValue),
      successfulRentals: data.successfulRentals || 0,
      reviewsWritten: data.reviewsWritten || 0,
    });

    // 🏅 badge logic
    const newBadges = new Set(data.badges || []);
    if ((data.successfulRentals || 0) >= 3) newBadges.add("Reliable Renter");
    if ((data.reviewsWritten || 0) >= 5) newBadges.add("Engaged Reviewer");
    if ((data.avgRating || 0) >= 4.5) newBadges.add("Perfect Partner");

    await updateDoc(userRef, { badges: Array.from(newBadges) });

    console.log(`✅ Gamification updated for ${userEmail}: +${incrementValue} pts`);
  } catch (error) {
    console.error("❌ Error updating gamification:", error);
  }
};
