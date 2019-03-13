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
  "is_companion": "false",
  "name": "Jenny",
  "email": "jenny_fake@gmail.com",
  "phone_number": "000 000 0000",
  "notification_preference": "Email",
  "mobility_level": "Low",
  "timezone": "Australia/Sydney",
  "availability": [
    {
      "day": "Monday",
      "timeslots": ["6:00 am", "6:30am"]
    },
    {
      "day": "Friday",
      "timeslots": ["7:00 am", "7:30 am", "8:00 am"]
    },
    {
      "day": "Saturday",
      "timeslots": ["6:00 am", "8:00 am"]
    }
  ],
  "recipient_name": "John",
  "recipient_email": "john_fake@yahoo.com",
  "recipient_phone_number": "888 888 8888",
  "recipient_mobility_level": "Medium"
}
```

### Response:

**201 (OK)**

> If you successfully created an invite the endpoint will return an HTTP response with a status code 201 and a body example as above + `id` field.

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
https://flextogether.herokuapp.com/api/invite/hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyNSwiaWF0IjoxNTUyMjg0NTc5LCJleHAiOjE1NTIzNzA5Nzl9.MsQbQ2kEp5ARg0d7nO7Cw-AYEyJL5urcrGei_S/verify
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
https://flextogether.herokuapp.com/api/invite/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyNSwiaWF0IjoxNTUyMjg0NTc5LCJleHAiOjE1NTIzNzA5Nzl9.MsQbQ2kEp5ARg0d7nO7Cw-AYEyJL5urcrGei_S_NAQc
```

### Response:

**200 (OK)**

> If the token is valid, the endpoint will return the HTTP status code 200 with invite object as shown below.

```json
{
  "id": 1,
  "is_companion": "false",
  "name": "Jenny",
  "email": "jenny_fake@gmail.com",
  "phone_number": "000 000 0000",
  "notification_preference": "Email",
  "mobility_level": "Low",
  "timezone": "Australia/Sydney",
  "availability": [
    {
      "day": "Monday",
      "timeslots": ["6:00 am", "6:30 am"]
    },
    {
      "day": "Friday",
      "timeslots": ["7:00 am", "7:30 am", "8:00 am"]
    },
    {
      "day": "Saturday",
      "timeslots": ["6:00 am", "8:00 am"]
    }
  ],
  "recipient_name": "John",
  "recipient_email": "john_fake@yahoo.com",
  "recipient_phone_number": "888 888 8888",
  "recipient_mobility_level": "Medium"
}
```

**400 (Bad Request)**

> If the token was invalid or malformed, the endpoint will return the HTTP status code of 400.

**500 (Internal Server Error)**

> If server encounters internal runtime error, the endpoint will return the HTTP status code of 500.

## When friend/family member selects their availability from options provided by a user.

HTTP Method: `POST`

URL: `/api/invite/:token/confirm`

### Headers

| Name         | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| Content-Type | String | Yes      | Must be application/json |

### Body

| name         | type  | required | description                                   |
| ------------ | ----- | -------- | --------------------------------------------- |
| availability | array | yes      | Choose any availability from options provided |

### Example:

URL:

```
https://flextogether.herokuapp.com/api/invite/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyNSwiaWF0IjoxNTUyMjg0NTc5LCJleHAiOjE1NTIzNzA5Nzl9.MsQbQ2kEp5ARg0d7nO7Cw-AYEyJL5urcrGei_S_NAQc/confirm
```

JSON:

```json
{
  "availability": [
    {
      "day": "Monday",
      "timeslots": ["6:00 am"]
    },
    {
      "day": "Friday",
      "timeslots": ["7:30 am"]
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

| name        | type   | required | description                              |
| ----------- | ------ | -------- | ---------------------------------------- |
| meetup_day  | string | yes      | Choose any Day from Monday - Sunday      |
| meetup_time | string | yes      | Choose any time between 6:00am - 11:00pm |

### Example:

URL:

```
https://flextogether.herokuapp.com/api/invite/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyNSwiaWF0IjoxNTUyMjg0NTc5LCJleHAiOjE1NTIzNzA5Nzl9.MsQbQ2kEp5ARg0d7nO7Cw-AYEyJL5urcrGei_S_NAQc/manual_confirm
```

JSON:

```json
{
  "meetup_day": "Monday",
  "meetup_time": "4:00 pm"
}
```

### Response:

**201 (OK)**

> If the token is valid and confirmation was successful, the endpoint will return the HTTP status code 201.

**400 (Bad Request)**

> If the token was invalid or malformed, the endpoint will return the HTTP status code of 400.

**500 (Internal Server Error)**

> If an email was not sent due to server/sendgrid error, the endpoint will return the HTTP status code of 500.
