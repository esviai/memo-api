# Memo API

It's a simple memo CRUD API where you need to sign in to read all of the memos.

The API can be accessed from [https://memo-api.herokuapp.com/](https://memo-api.herokuapp.com/)

## Server

### Authentication & Authorization
|Route |HTTP   |Description |
|------|-------|------------|
|`/signup`|POST|User sign up|
|`/signin`|POST|User sign in|

### Memos routes:
|Route |HTTP |Description |
|------|-----|------------|
|`/api/memos`| GET | Get all memos (authenticated user only)|
|`/api/memos`| POST | Create a new memo (authenticated user only)|
|`/api/memos/:id`| GET | Get a memo (authorized user only)|
|`/api/memos/:id`| PUT | Edit the memo (authorized user only)|
|`/api/memos/:id`| DELETE | Delete the memo (authorized user only)|

### User routes:
|Route |HTTP |Description |
|------|-----|------------|
|`/api/users`| GET | Get all users (authenticated user only)|
|`/api/users/:id`| GET | Get a users (authorized user only)|
|`/api/users/:id`| PUT | Edit the users (authorized user only)|
|`/api/users/:id`| DELETE | Delete the users (authorized user only)|

### Tools
- Nodejs
- Express
- Mongoose
