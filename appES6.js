//Class book
class Book{
	constructor(title,author,isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

class UI{
	addToBookList(book){
		const list = document.getElementById('bookList');
		//Create a tr element
		const row = document.createElement('tr');
		//Insert cols
		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="delete">X</a></td>`
		console.log(row);

		list.appendChild(row);
	}

	showAlert(message,className){
		const div = document.createElement('div');
		//Add class
		div.className = `alert ${className}`;
		//Append Textnode
		div.appendChild(document.createTextNode(message));
		//Get Parent
		const container = document.querySelector('.container');
		//Get Form
		const form = document.querySelector('#bookForm');
		//Insert alert
		container.insertBefore(div,form);
		//Timeout
		setTimeout(function(){document.querySelector('.alert').remove()},3000);
	}

	deleteBook(target){
		if(target.className === 'delete'){
			target.parentElement.parentElement.remove();
		}
	}

	clearFields(){
		document.getElementById('title').value = '';
		document.getElementById('author').value = '';
		document.getElementById('isbn').value = '';
	}

}
//Location Storage class
class Storage {
	static getBooks(){
		let books;
		if(localStorage.getItem('books') === null){
			books = [];
		}else{
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	static displayBooks(){
		const books = Storage.getBooks();
		books.forEach(function(book){
			const ui = new UI();

			//Add book to UI
			ui.addToBookList(book);
		});
	}

	static addBook(book){
		const books = Storage.getBooks();
		books.push(book);
		localStorage.setItem('books',JSON.stringify(books));

	}

	static removeBook(isbn){
		const books = Storage.getBooks();
		books.forEach(function(book,index){
			if(book.isbn === isbn){
				books.splice(index,1);
			}
		});
		localStorage.setItem('books',JSON.stringify(books));
	}
}


//DOM Load event

document.addEventListener('DOMContentLoaded',Storage.displayBooks);

document.getElementById('bookForm').addEventListener('submit',
	function(e){
	//Get form values
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const isbn = document.getElementById('isbn').value;

	//Instantiate book
	const book = new Book(title,author,isbn);

	//Instantiate UI
	const ui = new UI();

	//Validate
	if(title === '' || author === '' || isbn === ''){
		//Error
		ui.showAlert('Please fill out the fields','error');
	}else{
	//Add book to list
	ui.addToBookList(book);

	//Add book to localStorage
	Storage.addBook(book);

	//Show Alert
	ui.showAlert('Book added','success');
	}

	//Clear the UI
	ui.clearFields();

	e.preventDefault();

});

//Delete Eventlistener
document.getElementById('bookList').addEventListener('click',function(e){

	//Instantiate UI
	const ui = new UI();

	//Delete book
	ui.deleteBook(e.target);

	//Remove from LS
	Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);

	//showMessage
	ui.showAlert('Book Deleted','success');

	e.preventDefault();
});
