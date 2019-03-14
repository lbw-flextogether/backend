# Flextogether API

## Base URL

- https://flextogether.herokuapp.com/

## Create an Invite - when a user wants to send an invite to a friend/family member

HTTP Method: `POST`

URL: `/api/invite`

### Headers

| Name         | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| Content-Type | String | Yes      | Must be application/json |

### Body

| Name                     | Type    | Required | Description                                                               |
| ------------------------ | ------- | -------- | ------------------------------------------------------------------------- |
| is_companion             | boolean | yes      | Indicates if a user is a companion or not. (true = 1, false = 0)          |
| name                     | string  | yes      | Up tp 128 characters                                                      |
| email                    | string  | yes      | Up to 128 characters                                                      |
| phone_number             | string  | yes      | Min 10 and Max 15 characters                                              |
| notificaton_preference   | string  | yes      | Choose one option from Text, Email, Text & Email                          |
| mobility_level           | string  | yes      | Choose one option from Low, Medium, High                                  |
| timezone                 | string  | yes      | IANA timezone strings, validated against [https://momentjs.com/timezone/] |
| availability             | array   | yes      | Choose any Day from Monday - Sunday and any time between 6:00am - 11:00pm |
| recipient_name           | string  | yes      | Up to 128 characters                                                      |
| recipient_email          | string  | yes      | Up to 128 characters                                                      |
| recipient_phone_number   | string  | yes      | Min 10 and Max 15 characters                                              |
| recipient_mobility_level | string  | yes      | Choose one option from Low, Medium, High                                  |

### Example:

```json
{
  "is_companion": false,
  "name": "User1",
  "email": "user1_fake@gmail.com",
  "phone_number": "333 333 3333",
  "notification_preference": "Email",
  "mobility_level": "Medium",
  "timezone": "America/New_York",
  "availability": [
    {
      "day": "Tuesday",
      "timeslots": ["7:00 am", "8:30 am"]
    },
    {
      "day": "Wednesday",
      "timeslots": ["10:00 am", "10:30 am"]
    },
    {
      "day": "Sunday",
      "timeslots": ["8:00 am", "10:00 am", "4:00 pm"]
    }
  ],
  "recipient_name": "User2",
  "recipient_email": "user2_fake@gmail.com",
  "recipient_phone_number": "888 888 8888",
  "recipient_mobility_level": "High"
}
```

### Response:

**201 (OK)**

> If you successfully created an invite the endpoint will return an HTTP response with a status code 201 and a body example as above + `id` field + `token`.

**400 (Bad Request)**

> If you send in invalid fields, the endpoint will return an HTTP response with a status code 400 and a body example as below.

```
{
  "message": "\"recipient_mobility_level\" must be one of [Low, Medium, High]",
  "path": ["recipient_mobility_level"],
  "type": "any.allowOnly",
  "context": {
    "value": "",
    "valids": ["Low", "Medium", "High"],
    "key": "recipient_mobility_level",
    "label": "recipient_mobility_level"
  }
}
```

**500 (Internal Server Error)**

> If there was any error saving invite information, the endpoint will return an HTTP response with status code 500.

## When a user needs to verify an email in order to send an invite email to a friend/family member

HTTP Method: `POST`

URL: `/api/invite/:token/verify`

### Headers

| Name         | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| Content-Type | String | Yes      | Must be application/json |

### Example:

```
https://flextogether.herokuapp.com/api/invite/hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyNSwiaWF0IjoxNTUyMjg0NTc5LCJleHAiOjE1NTIzNzA5Nzl9.MsQbQ2kEp5ARg0d7nO7CyJL5urcrG/verify
```

### Response:

**201 (OK)**

> If the token is valid and the email is sent to the recipient, the endpoint will return the HTTP status code 201.

**400 (Bad Request)**

> If the token was invalid or malformed, the endpoint will return the HTTP status code of 400.

**500 (Internal Server Error)**

> If an email was not sent due to server/sendgrid error, the endpoint will return the HTTP status code of 500.

## When friend/family member gets an invite email with user's availability.

HTTP Method: `GET`

URL: `/api/invite/:token`

### Headers

| Name         | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| Content-Type | String | Yes      | Must be application/json |

### Example:

```
https://flextogether.herokuapp.com/api/invite/hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyNSwiaWF0IjoxNTUyMjg0NTc5LCJleHAiOjE1NTIzNzA5Nzl9.MsQbQ2kEp5ARg0d7nO7CyJL5urcrG
```

### Response:

**200 (OK)**

> If the token is valid, the endpoint will return the HTTP status code 200 with invite object as shown below.

```json
{
  "id": 1,
  "is_companion": false,
  "name": "User1",
  "email": "user1_fake@gmail.com",
  "phone_number": "333 333 3333",
  "notification_preference": "Email",
  "mobility_level": "Medium",
  "timezone": "America/New_York",
  "availability": [
    {
      "day": "Tuesday",
      "timeslots": ["7:00 am", "8:30 am"]
    },
    {
      "day": "Wednesday",
      "timeslots": ["10:00 am", "10:30 am"]
    },
    {
      "day": "Sunday",
      "timeslots": ["8:00 am", "10:00 am", "4:00 pm"]
    }
  ],
  "recipient_name": "User2",
  "recipient_email": "user2_fake@gmail.com",
  "recipient_phone_number": "888 888 8888",
  "recipient_mobility_level": "High"
}
```

**400 (Bad Request)**

> If the token was invalid or malformed, the endpoint will return the HTTP status code of 400.

**500 (Internal Server Error)**

> If server encounters internal runtime error, the endpoint will return the HTTP status code of 500.

## When friend/family member selects their availability based on their timezone from the options provided by a user.

HTTP Method: `POST`

URL: `/api/invite/:token/confirm`

### Headers

| Name         | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| Content-Type | String | Yes      | Must be application/json |

### Body

| name         | type   | required | description                                                               |
| ------------ | ------ | -------- | ------------------------------------------------------------------------- |
| timezone     | string | yes      | IANA timezone strings, validated against [https://momentjs.com/timezone/] |
| availability | array  | yes      | Choose any availability from options provided                             |

### Example:

URL:

```
https://flextogether.herokuapp.com/api/invite/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTU1MjU5MjY5NiwiZXhwIjoxNTUyNjc5MDk2fQ.hMX8RnGrjrwr5PzkUfJzFkW-nYzFqja8BZJ/confirm
```

JSON:
Friend/family member will enter their timezone first that will update the timeslots and then they will select their preferred day and times.

```json
{
  "timezone": "America/Los_Angeles",
  "availability": [
    {
      "day": "Wednesday",
      "timeslots": ["7:00 am", "7:30 am"]
    }
  ]
}
```

### Response:

**201 (OK)**

> If the token is valid and confirmation was successful, the endpoint will return the HTTP status code 201.

**400 (Bad Request)**

> If the token was invalid or malformed, the endpoint will return the HTTP status code of 400.

**500 (Internal Server Error)**

> If an email was not sent due to server/sendgrid error, the endpoint will return the HTTP status code of 500.

## When no time works out for friend/family member then they can select a day and time manually by confirming user via phone call.

HTTP Method: `POST`

URL: `/api/invite/:token/manual_confirm`

### Headers

| Name         | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| Content-Type | String | Yes      | Must be application/json |

### Body

| name        | type   | required | description                                                               |
| ----------- | ------ | -------- | ------------------------------------------------------------------------- |
| timezone    | string | yes      | IANA timezone strings, validated against [https://momentjs.com/timezone/] |
| meetup_day  | string | yes      | Choose any Day from Monday - Sunday                                       |
| meetup_time | string | yes      | Choose any time between 6:00am - 11:00pm                                  |

### Example:

URL:

```
https://flextogether.herokuapp.com/api/invite/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTU1MjU5MjY5NiwiZXhwIjoxNTUyNjc5MDk2fQ.hMX8RnGrjrwr5PzkUfJzFkW-nYzFqja8BZJ/manual_confirm
```

JSON:

Friend/family member will enter/select their timezone first and then enter the confirmed day and time manually.

```json
{
  "timezone": "America/Los_Angeles",
  "meetup_day": "Sunday",
  "meetup_time": "7:30 am"
}
```

### Response:

**201 (OK)**

> If the token is valid and confirmation was successful, the endpoint will return the HTTP status code 201.

**400 (Bad Request)**

> If the token was invalid or malformed, the endpoint will return the HTTP status code of 400.

**500 (Internal Server Error)**

> If an email was not sent due to server/sendgrid error, the endpoint will return the HTTP status code of 500.
