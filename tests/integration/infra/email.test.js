import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Test <testlocalemail@test.com>",
      to: "contact@emailtest.com",
      subject: "Test email",
      text: "Body text.",
    });

    await email.send({
      from: "Test <testlocalemail@test.com>",
      to: "contact@emailtest.com",
      subject: "Last email sended",
      text: "Last body text.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<testlocalemail@test.com>");
    expect(lastEmail.recipients[0]).toBe("<contact@emailtest.com>");
    expect(lastEmail.subject).toBe("Last email sended");
    expect(lastEmail.text.trimEnd()).toBe("Last body text.");
  });
});
