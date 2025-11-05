##Testing Instructions
1.Git clone the repository 
2.'cd <repository_folder>' 
3.'npm install'
4.'npm run dev'
5.Go to address "http://localhost:4000"
6.Paste Test queries to Operation Field
7.Click to desired query and run button

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
