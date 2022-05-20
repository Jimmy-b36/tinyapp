TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screeshot of the login page for app"]('https://github.com/Jimmy-b36/tinyapp/blob/main/docs/Login_page.png')
!["Screenshot of the main url page"](https://github.com/Jimmy-b36/tinyapp/blob/main/docs/Main_URL_page.png)
!["Screenshot update URL page"](https://github.com/Jimmy-b36/tinyapp/blob/main/docs/Update_URL_page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Usage

- Use (email: a@a.com, password: test) to test site with full access.
- Register a new user on the registration page.
- Logging in for a second time overwrites the current logged in user.
- Deleting a tinyURL results in a permanent deletion.
- Only the logged in user can edit their own creations.
- Anyone can access you're created URLs using /u/UNIQUE-URL-HERE.

## Known issues

- None that I've found, please let me know if you find any bugs!
