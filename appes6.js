class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
  }
}

class Ui {

  addBookToList(book){
    const list = document.getElementById('book-list');
    // create element
    const row = document.createElement('tr');
    console.log(book);
    // Insert cols
    row.innerHTML= `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td><button class="delete" style="float: right">Remove</button></td>`;
  
    list.appendChild(row); 
  }

 
  showAlert(message, className){
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#book-form');
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);

  }

  clearFields(book){
    document.getElementById('title').value = '';
    document.getElementById('author').value= '';
  }

  deleteBook(target){
    if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
    }
  }
}
 // Local Storage Class
 class Store {

  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks(){
    const books = Store.getBooks();

    books.forEach(function(book) {
      const ui = new Ui;

      // Add Book to Ui
      ui.addBookToList(book);
    });
  }

  static addBook(book){
    
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(author){
    console.log(author);
    const books = Store.getBooks();

    books.forEach(function(book, index){
      if(book.author === author){
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event 

document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners for Addbook

document.getElementById('book-form').addEventListener('submit', 
function(e){
  // Get Form values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  //instanciate book
  const book = new Book(title, author);

  //instanciate UI 
  const ui =  new Ui();
  console.log(ui);

  // Validation
  if(title === '' || author === '') {
    //error alert
    ui.showAlert('Please fill in all fields.', 'error');

  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to LS
    Store.addBook(book);

    // Show success
    ui.showAlert('Book Added ! ', 'success');
    //Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener For delete

document.getElementById('book-list').addEventListener('click', function(e){
  
  const ui = new Ui();

  ui.deleteBook(e.target);

  // Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show alert
  ui.showAlert('Book removed', 'success');
  e.preventDefault();

});