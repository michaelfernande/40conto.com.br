import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "testeMesmoCase",
        email: "mesmo.case@gmail.com",
        password: "testeSenha",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/testeMesmoCase",
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "testeMesmoCase",
        email: "mesmo.case@gmail.com",
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });
    test("With exact case mismatch", async () => {
      await orchestrator.createUser({
        username: "testeDiferenteCase",
        email: "diferente.case@gmail.com",
        password: "testeSenha",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/testediferenteCase",
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "testeDiferenteCase",
        email: "diferente.case@gmail.com",
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });
    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username não foi encontrado no sistema",
        action: "Verifique se o username está escrito corretamente",
        status_code: 404,
      });
    });
  });
});
