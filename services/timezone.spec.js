const timeZoneService = require("./timezone");

describe("TimezoneService", () => {
  it("convertTimeToTimezone() converts timezone", () => {
    expect(
      timeZoneService.convertTimeToTimezone(
        "11:00 am",
        "America/New_York",
        "America/Los_Angeles"
      )
    ).toBe("8:00 am");

    expect(
      timeZoneService.convertTimeToTimezone(
        "5:00 pm",
        "America/New_York",
        "America/Los_Angeles"
      )
    ).toBe("2:00 pm");

    expect(
      timeZoneService.convertTimeToTimezone(
        "5:00 pm",
        "America/Los_Angeles",
        "America/New_York"
      )
    ).toBe("8:00 pm");
  });
});
