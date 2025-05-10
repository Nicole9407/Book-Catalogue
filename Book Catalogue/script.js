document.addEventListener('DOMContentLoaded', function() {
    // --- Book count logic ---
    const bookItems = document.querySelectorAll('#my-books-grid .book-item');
    const bookCount = bookItems.length;
    const countNavSpan = document.getElementById('count-nav');
    if (countNavSpan) {
      countNavSpan.textContent = bookCount;
    }
  
    // --- Author count logic ---
    const authorParagraphs = document.querySelectorAll('#my-books-grid .book-item p');
    const authors = new Set();
  
    authorParagraphs.forEach(p => {
      const textContent = p.textContent;
      if (textContent.startsWith('Author:')) {
        const authorName = textContent.substring('Author:'.length).trim();
        authors.add(authorName);
      }
    });
  
    const totalAuthors = authors.size;
    const authorCountElement = document.createElement('p');
    authorCountElement.textContent = `Total Authors: ${totalAuthors}`;
    authorCountElement.style.textAlign = 'center';
    authorCountElement.style.marginTop = '15px';
  
    const booksGrid = document.getElementById('my-books-grid');
    if (booksGrid && booksGrid.parentNode) {
      let existingAuthorCount = booksGrid.parentNode.querySelector('p[style*="text-align: center;"][style*="margin-top: 15px;"]');
      if (existingAuthorCount) {
        existingAuthorCount.textContent = `Total Authors: ${totalAuthors}`;
      } else {
        booksGrid.parentNode.insertBefore(authorCountElement, booksGrid);
      }
    }
  
    // --- Sorting logic ---
    const sortSelect = document.getElementById('sort-books');
  
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            console.log("Dropdown value changed to:", selectedValue);
            try {
              const booksGrid = document.getElementById('my-books-grid');
              const bookItems = Array.from(booksGrid.querySelectorAll('.book-item'));
              const bookRow = document.querySelector('#my-books-grid .book-row');
        
              if (bookRow) {
                const booksData = bookItems.map(item => {
                  const titleElement = item.querySelector('h3');
                  let author = '';
                  const paragraphs = item.querySelectorAll('p');
                  paragraphs.forEach(p => {
                    if (p.textContent.startsWith('<strong>Author:</strong>')) {
                      const authorText = p.textContent.substring('<strong>Author:</strong>'.length).trim().toLowerCase();
                      const firstAuthorMatch = authorText.split('(author)')[0].trim();
                      author = firstAuthorMatch.endsWith(',') ? firstAuthorMatch.slice(0, -1).trim() : firstAuthorMatch;
                    } else if (p.textContent.startsWith('Author:')) {
                      const authorText = p.textContent.substring('Author:'.length).trim().toLowerCase();
                      const firstAuthorMatch = authorText.split('(author)')[0].trim();
                      author = firstAuthorMatch.endsWith(',') ? firstAuthorMatch.slice(0, -1).trim() : firstAuthorMatch;
                    }
                  });
                  const releaseDateElement = item.querySelector('p:nth-of-type(2)');
                  const releaseDateText = releaseDateElement ? releaseDateElement.textContent.substring('Release Date:'.length).trim() : '';
                  const dateParts = releaseDateText.split('/');
                  const releaseDate = releaseDateText ? new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0])) : null;
        
                  console.log("Extracted:", { title: titleElement ? titleElement.textContent : '', author, releaseDate });
        
                  return { item, title: titleElement ? titleElement.textContent : '', author, releaseDate };
                });
        
                let sortedBooks;
                if (selectedValue === 'author-az') {
                  sortedBooks = booksData.sort((a, b) => a.author.localeCompare(b.author));
                } else if (selectedValue === 'author-za') {
                  sortedBooks = booksData.sort((a, b) => b.author.localeCompare(a.author));
                } else if (selectedValue === 'release-date') {
                  sortedBooks = booksData.sort((a, b) => (a.releaseDate ? a.releaseDate.getTime() : -Infinity) - (b.releaseDate ? b.releaseDate.getTime() : -Infinity));
                } else if (selectedValue === 'books-az') {
                  sortedBooks = booksData.sort((a, b) => {
                    console.log("Comparing Title A:", a.title, "with Title B:", b.title);
                    return a.title.localeCompare(b.title);
                  });
                } else if (selectedValue === 'books-za') {
                  sortedBooks = booksData.sort((a, b) => {
                    console.log("Comparing Title A:", b.title, "with Title B:", a.title);
                    return b.title.localeCompare(a.title);
                  });
                } else {
                  sortedBooks = booksData;
                }
        
                console.log("Book data after sort:", sortedBooks);
        
                bookRow.innerHTML = '';
                sortedBooks.forEach(book => {
                  bookRow.appendChild(book.item);
                });
              }
            } catch (error) {
                console.error("An error occurred in the sort function:", error);
              }
            }); // Closing brace for the 'change' event listener
          } // Closing brace for the 'if (sortSelect)' block
          }); // Closing brace for the 'DOMContentLoaded' event listener