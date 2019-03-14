const request = require("supertest");
const server = require("./server.js");
const Email = require("../services/email");

const inviteBody = {
  is_companion: "false",
  name: "Jenny",
  email: "jenny_fake@gmail.com",
  phone_number: "000 000 0000",
  notification_preference: "Email",
  mobility_level: "Low",
  timezone: "Australia/Sydney",
  availability: [
    {
      day: "Monday",
      timeslots: ["6:00 am", "6:30 am"]
    },
    {
      day: "Friday",
      timeslots: ["7:00 am", "7:30 am", "8:00 am"]
    },
    {
      day: "Saturday",
      timeslots: ["6:00 am", "8:00 am"]
    }
  ],
  recipient_name: "John",
  recipient_email: "john_fake@yahoo.com",
  recipient_phone_number: "888 888 8888",
  recipient_mobility_level: "Medium"
};

describe("FlexTogether", () => {
  // testing POST invite
  describe("POST '/api/invite'", () => {
    it("should return 400 when body is empty", async () => {
      const body = {};
      const res = await request(server)
        .post("/api/invite")
        .send(body);
      expect(res.status).toBe(400);
    });

    it("should return 400 when one or more fields are empty", async () => {
      Email.sendVerfication = jest.fn();

      const res = await request(server)
        .post("/api/invite")
        .send({
          ...inviteBody,
          name: "",
          email: ""
        });
      expect(res.status).toBe(400);
    });

    it("should return 201 with newly created invite and token", async () => {
      Email.sendVerfication = jest.fn();

      const res = await request(server)
        .post("/api/invite")
        .send(inviteBody);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("token");
    });
  });

  // testing GET invite by token
  describe("GET '/api/invite/:token'", () => {
    it("should return 200", async () => {
      Email.sendVerfication = jest.fn();
      const { body } = await request(server)
        .post("/api/invite")
        .send(inviteBody);
      const res = await request(server).get(`/api/invite/${body.token}`);

      expect(res.status).toBe(200);
    });
    it("should return invite by id", async () => {
      Email.sendVerfication = jest.fn();
      const { body } = await request(server)
        .post("/api/invite")
        .send(inviteBody);

      const res = await request(server).get(`/api/invite/${body.token}`);
      expect(res.body.id).toBe(body.id);
    });
  });

  //testing POST for email verification
  describe("POST 'api/invite/:token/verify'", () => {
    it(" should return 201", async () => {
      Email.sendVerfication = jest.fn();
      Email.sendInvitation = jest.fn();

      const { body } = await request(server)
        .post("/api/invite")
        .send(inviteBody);

      const res = await request(server)
        .post(`/api/invite/${body.token}/verify`)
        .send();

      expect(res.status).toBe(201);
    });
  });

  // testing POST confirm invite by token
  describe("POST '/api/invite/:token/confirm'", () => {
    it("should return 201 with meetup_time and meetup_day", async () => {
      Email.sendVerfication = jest.fn();
      Email.sendInvitation = jest.fn();
      Email.sendConfirmation = jest.fn();

      const { body } = await request(server)
        .post("/api/invite")
        .send(inviteBody);

      const res = await request(server)
        .post(`/api/invite/${body.token}/confirm`)
        .send({
          timezone: "America/Los_Angeles",
          availability: [
            {
              day: "Monday",
              timeslots: ["6:00 am", "6:30 am"]
            }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        meetup_day: "Monday",
        meetup_time: "6:00 am"
      });
    });

    it("should return 400 if token is invalid", async () => {
      const res = await request(server)
        .post(`/api/invite/invalidToken/confirm`)
        .send({
          timezone: "America/Los_Angeles",
          availability: [
            {
              day: "Monday",
              timeslots: ["6:00 am", "6:30 am"]
            }
          ]
        });

      expect(res.status).toBe(400);
    });
  });

  // testing POST manual confirmation by token
  describe("POST '/api/invite/:token/manual_confirm'", () => {
    it("should return 400 if token is invalid", async () => {
      const res = await request(server)
        .post(`/api/invite/invalidToken/manual_confirm`)
        .send({
          timezone: "America/Los_Angeles",
          meetup_day: "Saturday",
          meetup_time: "8:00 pm"
        });

      expect(res.status).toBe(400);
    });

    it("should return 201 with meetup_day and meetup_time", async () => {
      Email.sendVerfication = jest.fn();
      Email.sendInvitation = jest.fn();
      Email.sendConfirmation = jest.fn();

      const { body } = await request(server)
        .post("/api/invite")
        .send(inviteBody);

      const res = await request(server)
        .post(`/api/invite/${body.token}/manual_confirm`)
        .send({
          timezone: "America/Los_Angeles",
          meetup_day: "Saturday",
          meetup_time: "6:30 am"
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        meetup_day: "Saturday",
        meetup_time: "6:30 am"
      });
    });
  });
});
