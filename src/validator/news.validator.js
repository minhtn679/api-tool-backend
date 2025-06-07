import { body } from "express-validator";

export const CreateNewsDTO = [
   body("title", "Tiêu đề bài viết không được trống").notEmpty(),
   body("thumbnail", "Thumbnail không được trống").notEmpty(),
   body("description", "Mô tả không được trống").notEmpty(),
   body("slug", "Slug không được trống").notEmpty(),
   body("content", "Nội dung không được trống").notEmpty(),
];

export const RatingDTO = [body("rate", "Chỉ số đánh giá không được trống").notEmpty()];