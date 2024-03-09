import { Router } from "express";
import * as Tour from "./tour.controller.js";
import { allowedTo, auth } from "../../middlewares/auth.js";
import { uploadMixfile } from "../../middlewares/fileUpload.js";
import { saveImg } from "../../middlewares/uploadToCloud.js";
const tourRouter = Router();

tourRouter
  .route("/")
  .get(Tour.getAllTour)
  .post(
    auth,
    allowedTo("admin"),
    uploadMixfile([
      { name: "mainImg", maxCount: 1 },
      { name: "images", maxCount: 5 }
    ]),
    saveImg,
    Tour.createTour
  );

tourRouter
  .route("/:id")
  .get(Tour.getTourById)
  .delete(auth, allowedTo("admin"), Tour.deleteTour)
  .patch(
    auth,
    allowedTo("admin"),
    uploadMixfile([
      { name: "mainImg", maxCount: 1 },
      { name: "images", maxCount: 5 }
    ]),
    saveImg,
    Tour.updateTour
  );

export default tourRouter;
