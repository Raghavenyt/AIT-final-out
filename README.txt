AIT — AI Toolbox
=================

This is a fully working Node.js + Express backend with your AIT HTML/CSS
frontend wired to it.

How to run
----------
1. Open a terminal in the backend folder:

     cd ait-tools-site/backend

2. Install dependencies:

     npm install

3. Start the server:

     npm start

4. Open this URL in your browser:

     http://localhost:3000

What it does
------------
- The homepage shows categories (Content Writing, Coding Tools, Image Editing, etc.)
  loaded from the backend (`GET /api/categories`).

- When you click a category, it opens a modal and loads tools for that category
  from the backend (`GET /api/tools?category=...`).

- You can search categories from the top search bar.

- You can filter tools inside the modal with the "Filter tools in this category"
  input.

- Favorites are stored locally in your browser using localStorage and shown in
  a favorites bar and in a Favorites modal.

API endpoints
-------------
- GET /api/categories
    → Returns all categories.

- GET /api/tools
    → Optional query params:
       * category=<categoryId>
       * q=<search term>

- POST /api/tools
    Body JSON:
      {
        "categoryId": "content",
        "name": "New Tool",
        "short": "Short description",
        "price": "Free",
        "url": "https://example.com"
      }

- DELETE /api/tools/:id
    → Removes a tool by id (not currently used by the UI, but available).
