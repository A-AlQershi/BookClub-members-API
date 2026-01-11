# BookClub members API

A minimal Express + MongoDB REST API for managing Book Club members, including avatar upload support. Built with Express, Mongoose, Multer, and CORS, configured via environment variables.

- Tech: Node.js, Express 5, Mongoose, Multer, CORS, dotenv
- Data: MongoDB collection "bookClub"
- Features: CRUD for members, file upload for avatars, basic validation

## Project Structure

```
root/
├─ server.js              # App entry, Express setup, Mongo connection, route mount
├─ routes/
│  └─ membersRoutes.js    # Members CRUD + avatar upload via Multer
├─ models/
│  └─ Members.js          # Mongoose schema/model (name, age, avatar)
├─ uploads/               # Stored avatar files (created by Multer)
├─ package.json
└─ README.md
```

## Environment Variables

Create a .env file in the project root like this example:

```
PORT=3000
databaseURL="mongodb://localhost:<port>/<DB name>"  #you get the databaseURL from MongoDB
```

- PORT: Port the server listens on.
- databaseURL: Your MongoDB connection string. The model writes to collection "bookClub".

## Installation

1. Install dependencies

```
npm install
```

2. Configure environment (.env as above).

3. Run the server

- Development (auto-restart):

```
npm run dev
```

- Production:

```
npm start
```

On successful start, you should see "Connected to MongoDB" in the console. The root endpoint responds with:

GET /

- 200 OK: "Welcome to the club!"

## API Overview

Base URL: http://localhost:<PORT>

All Members routes are mounted at /members.

### Data Model (Members)

- name: string (required)
- age: number (required)
- avatar: string (required, filename saved by Multer)

Documents include createdAt and updatedAt timestamps.

### Endpoints

1. GET /members

- Description: List all members
- Response: 200 OK → JSON array of members

2. GET /members/:id

- Description: Get a member by Mongo ObjectId
- Validations: 400 if invalid ID; 404 if not found
- Response: 200 OK → JSON member

3. POST /members

- Description: Create a member with avatar upload
- Content-Type: multipart/form-data
- Form fields:
  - name: string
  - age: number
  - avatar: file (field name "avatar")
- Behavior: Multer stores file in /uploads and sets req.body.avatar to the stored filename.
- Response: 201 Created → JSON of created member

4. PUT /members/:id

- Description: Update name/age/avatar filename
- Body: JSON payload (no Multer on PUT; send avatar filename if you want to change it)
- Response: 200 OK → updated member (runValidators: true)

5. DELETE /members/:id

- Description: Delete member by ID
- Side effect: Attempts to delete associated avatar file from /uploads
- Response: 200 OK → deleted member

### Request Examples

- Create member (with avatar) using curl:

```
curl -X POST http://localhost:3000/members \
  -F "name=Alice" \
  -F "age=28" \
  -F "avatar=@/absolute/path/to/picture.jpg"
```

- Update member:

```
curl -X PUT http://localhost:3000/members/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Cooper","age":29}'
```

- Delete member:

```
curl -X DELETE http://localhost:3000/members/<id>
```

## Notes and Considerations

- File Serving: This project stores avatar filenames but does not serve static files from /uploads. To serve them, add:

```
app.use('/uploads', express.static('uploads'))
```

- Validation: Basic Mongoose required fields are in place. Consider adding stricter validation and error normalization for production.
- Security: Review file upload constraints (file type/size), and configure MongoDB credentials via environment variables. Consider rate limiting and headers hardening for public deployments.
- IDs: membersRoutes validates :id with mongoose.Types.ObjectId.isValid and 404s when not found.

## Scripts

- npm run dev → nodemon server.js
- npm start → node server.js
