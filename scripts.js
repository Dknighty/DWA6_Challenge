import { authors } from "./data.js"; 
import { books } from "./data.js";
import { genres } from "./data.js"; 
import { BOOKS_PER_PAGE} from "./data.js"

 const settingsButton = document.querySelector('[data-header-settings]')
 const settingsOverlay = document.querySelector('[data-settings-overlay]')
 const settingsForm = document.querySelector('[data-settings-form]')  // in order for the preview to work elements from the DOM needed to be retrieved using a document.queryselector
 const settingsTheme = document.querySelector('[data-settings-theme]')
 const settingsCancel = document.querySelector('[data-settings-cancel]')
 
 const listItems = document.querySelector('[data-list-items]')
 const moreButton = document.querySelector('[data-list-button]')
 
 



let matches = books;  // the array of books is the same as the variable matches 
let page = 1;                                           // added in a "let" so as to declare the variables 
const range = [0 , BOOKS_PER_PAGE]; 

if (!books || !Array.isArray(books)) { // changed the && to || 
    throw new Error('Source required') // moved {} line down so as to increase readability 
 }
if (!range && range.length === 2) { 
    throw new Error('Range must be an array with two numbers')
} 
const newPreview = (preview) => {
    const { author: authorId, id, image, title } = preview // destructuring the array so as to extract the elements of the authors array
    const showPreview = document.createElement("button"); // creates a button in order to present a preview of the books 
    showPreview.classList = 'preview' 
    showPreview.setAttribute('data-preview', id)

showPreview.innerHTML = /* html */ `
<img
class="preview__image"
src="${image}"                  
/>
<div class="preview__info">
    <h3 class="preview__title">${title}</h3>
    <div class="preview__author">${authors[authorId]}</div>
</div>
`
// this creates the html preview with images of the books, the authors 
return showPreview  // the return ensures that the button is created in the html 
} 

const bookFragment = document.createDocumentFragment()

const startOfIndex = (page - 1) * BOOKS_PER_PAGE // the variables startOfIndex and endOfIndex will ensure that each loaded preview will only be 36 books long, 0 - 36 
const endOfIndex = startOfIndex + BOOKS_PER_PAGE  

const bookExtracted = books.slice(startOfIndex, endOfIndex)


for (const preview of bookExtracted) {
    
    const showPreview = newPreview(preview)
    bookFragment.appendChild(showPreview)     // The loop will iterate over the preview that has been made for the books 
}

listItems.appendChild(bookFragment);

moreButton.addEventListener('click', () => {
    page++;  
    /* this adds an eventListener that will allow a button for a show more option to appear 
    * when clicked by the user, the page will displayed another 36 sets of books onto the webpage 
    */ 

    const newStartIndex = (page - 1) * BOOKS_PER_PAGE
    const newEndIndex = newStartIndex + BOOKS_PER_PAGE
    const newBookExtracted = books.slice(newStartIndex, newEndIndex)
    const newBookFragment = document.createDocumentFragment()

    for (const preview of newBookExtracted) {
        const showPreview = newPreview(preview)
        newBookFragment.appendChild(showPreview)
    }

    listItems.appendChild(newBookFragment);

    const remaining = matches.length - page * BOOKS_PER_PAGE; // using the matches variable which was previously declared, the "remaining" variable is created 
    moreButton.innerHTML = /* HTML */ `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;

    moreButton.disabled = remaining <= 0;  // once the remaining amount of books is either equal to or less than zero the show more button will be disabled.
})


moreButton.innerHTML = /* HTML */
    `<span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
    `;

settingsButton.addEventListener('click', () => {
    settingsOverlay.showModal()
})
/*these two eventListeners will check to see whether 
* the user has clicked the "change theme" icon 
* and if the user clicked the cancel option, 
* which closes the "change theme" option 
*/ 
settingsCancel.addEventListener('click', () => { 
    settingsOverlay.close()
})


const css = {
    day : ['255, 255, 255', '10, 10, 20'],   // A css object is used to define the two themes specified Night and Day 
    night: ['10, 10, 20', '255, 255, 255']
}

//The value of the settingsTheme input is determined based on whether the user's preferred color scheme is dark or not.
settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'


// When the form is submitted, the selected object is created by converting the form data to an object using Object.fromEntries(). 
settingsForm.addEventListener('submit', (event) => { 
    event.preventDefault()
    const formSubmit = new FormData(event.target)
    const selected = Object.fromEntries(formSubmit)


    if (selected.theme === 'night') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])     // Depending on the theme selected, the --color-light and --color-dark CSS variables are updated with the corresponding light and dark color values from the css object
    } else if (selected.theme === 'day') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])
    }

    settingsOverlay.close()
}); 
