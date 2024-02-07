import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import userController from "../controller/user-controller";

const userRouter = express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.getMeHandler);
userRouter.get("/api/users", userController.getAllUser);

// // Contact API
// userRouter.post('/api/contacts', contactController.create);
// userRouter.get('/api/contacts/:contactId', contactController.get);
// userRouter.put('/api/contacts/:contactId', contactController.update);
// userRouter.delete('/api/contacts/:contactId', contactController.remove);
// userRouter.get('/api/contacts', contactController.search);

// // Address API
// userRouter.post('/api/contacts/:contactId/addresses', addressController.create);
// userRouter.get('/api/contacts/:contactId/addresses/:addressId', addressController.get);
// userRouter.put('/api/contacts/:contactId/addresses/:addressId', addressController.update);
// userRouter.delete('/api/contacts/:contactId/addresses/:addressId', addressController.remove);
// userRouter.get('/api/contacts/:contactId/addresses', addressController.list);

export { userRouter };
