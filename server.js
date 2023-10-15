import { fastify } from "fastify";
// import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const PORT = process.env.PORT ?? 3333;
const server = fastify();

// const database = new DatabaseMemory();
const database = new DatabasePostgres();

server.post("/videos", async (req, reply) => {
  const { title, description, duration } = req.body;

  await database.create({
    title,
    duration,
    description,
  });

  return reply.status(201).send();
});

server.get("/videos", async (req) => {
  const search = req.query.search;
  const videos = await database.list(search);

  return videos;
});

server.put("/videos/:id", async (req, reply) => {
  const id = req.params.id;
  const { title, description, duration } = req.body;
  console.log(id, title, description, duration);
  await database.update(id, { title, description, duration });
  return reply.status(204).send();
});

server.delete("/videos/:id", async (req, reply) => {
  const id = req.params.id;
  console.log(id);
  await database.delete(id);
  return reply.status(204).send();
});

server.listen({port: PORT});
