import { Router } from "express";
import { changeBookingStatus, createBooking, listMyBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { bookingValidator, statusValidator } from "../validators/domainValidators.js";

const router = Router();

router.get("/mine", protect, listMyBookings);
router.post("/", protect, bookingValidator, validate, createBooking);
router.patch("/:id/status", protect, statusValidator, validate, changeBookingStatus);

export default router;
