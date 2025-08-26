import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// GET /api/properties?featured=true&limit=12&page=1
router.get("/", async (req, res) => {
  const { featured, limit = "12", page = "1" } = req.query;
  const lim = Math.max(1, parseInt(limit, 10));
  const pg = Math.max(1, parseInt(page, 10));
  const offset = (pg - 1) * lim;

  const where = [];
  const params = [];

  if (featured === "true") {
    where.push("featured = 1");
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = await db.all(
    `
    SELECT
      id,
      title,
      description,
      price,
      city,
      state,
      image_url   AS imageUrl,
      featured,
      created_at  AS createdAt
    FROM properties
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...params, lim, offset]
  );

  res.json(rows);
});

// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = await db.get(
    `
    SELECT
      id, title, description, price, city, state,
      image_url AS imageUrl, featured, created_at AS createdAt
    FROM properties WHERE id = ?
    `,
    id
  );
  if (!row) return res.status(404).json({ message: "Property not found" });
  res.json(row);
});

export default router;
