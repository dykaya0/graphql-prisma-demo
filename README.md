## Testing Instructions

1. Git clone the repository 
2. 'cd <repository_folder>' 
3. 'npm install'
4. Install docker cli (On Windows paste this command to terminal: 'winget install -e --id Docker.DockerDesktop')
6. Pull postgres's latest image (Terminal: docker pull postgres:latest)
7. Create postgres's container 
( docker run -d `
  --name graphqldemo-container
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=1234 `
  -e POSTGRES_DB=graphqldemo `
  -p 5432:5432 `
  postgres:latest )
8. Check container status (docker ps)
9. Create .env file on project root for database url 
( DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase
" )
10. 'npm run dev'
11. Go to address "http://localhost:4000"
12. Paste Test queries to Operation Field
13. Click to desired query and run button

### Test Queries

#### User

query GetUsers{
  getAllUsers {
    id
    email
  }
}

query GetUserById{
  getUser(id:3) {
    id
    email
  }
}

mutation {
  updateUser(id: 1,email: "user1@example.com") {
    id
    email
  }
}

mutation {
  addUser(id: 1,email: "updated_user1@example.com") {
    id
    email
  }
}

#### Book

query GetAllBooks{
  getAllBooks {
    title
    author
    publisher
    releaseDate
    pageCount
    volume
  }
}

query GetAllBooksPageCounts{
  getAllBooks {
    title
    author
    pageCount
  }
}
query GetAllBooksReleaseDate{
  getAllBooks {
    title
    author
    releaseDate
  }
}
mutation {
  addBook(title:"Dune",
  author: "Frank Herbert",
  publisher: "Ithaki Yayinlari",
  releaseDate: "2018",
  pageCount: "527",
  volume: "3",) {
    title
    author
    publisher
    releaseDate
    pageCount
    volume
  }
}

mutation {
  updateBook(title:"Crime And Punishment",
  author: "Fyodor Dostoyevsky",
  publisher: "Yapi Kredi Yayinlari",
  releaseDate: "1997",
  pageCount: "859",
  volume: "13",) {
    title
    author
    publisher
    releaseDate
    pageCount
    volume
  }
}
