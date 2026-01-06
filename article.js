document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  // Elements
  const titleEl = document.getElementById("article-title");
  const categoryEl = document.getElementById("article-category");
  const dateEl = document.getElementById("article-date");
  const contentEl = document.getElementById("article-body");
  const relatedContainer = document.getElementById(
    "related-articles-container"
  );

  // Find article
  const article = articlesData.find((a) => a.id === articleId);

  if (article) {
    // Set document title
    document.title = `${article.title} - Akili Studios`;

    // Populate content
    titleEl.textContent = article.title;
    categoryEl.textContent = article.category;
    dateEl.textContent = article.date;

    contentEl.innerHTML = article.content;

    // Populate Related Articles (Excluding current)
    const otherArticles = articlesData.filter((a) => a.id !== articleId);

    // Pick up to 4 other articles
    const shuffled = otherArticles.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    if (selected.length > 0) {
      relatedContainer.innerHTML = selected
        .map(
          (item) => `
                <a href="article.html?id=${item.id}" class="article-card" style="text-decoration: none; color: inherit;">
                    <div class="card-content">
                        <h4>${item.title}</h4>
                        <p class="category">${item.category} &bull; ${item.readTime}</p>
                    </div>
                    <span class="arrow"><i class="fas fa-arrow-up"></i></span>
                </a>
            `
        )
        .join("");
    } else {
      relatedContainer.innerHTML =
        "<p>No other articles available at the moment.</p>";
    }
  } else {
    // No ID or Invalid ID - Show All Articles if no ID, or Error if invalid
    if (!articleId) {
      document.title = `All Articles - Akili Studios`;
      titleEl.textContent = "All Articles";
      categoryEl.style.display = "none";
      dateEl.style.display = "none";

      // List all articles
      contentEl.innerHTML = `
                <div class="articles-flex" style="flex-wrap: wrap; gap: 20px;">
                    ${articlesData
                      .map(
                        (item) => `
                        <a href="article.html?id=${item.id}" class="article-card" style="width: 100%; max-width: 48%; margin-bottom: 20px; text-decoration: none; color: inherit;">
                            <div class="card-content">
                                <h4>${item.title}</h4>
                                <p class="category">${item.category}</p>
                            </div>
                            <span class="arrow"><i class="fas fa-arrow-up"></i></span>
                        </a>
                    `
                      )
                      .join("")}
                </div>
             `;

      // Hide related stats
      document.querySelector(".related-articles").style.display = "none";
    } else {
      // Article not found but ID was provided
      titleEl.textContent = "Article Not Found";
      contentEl.innerHTML =
        "<p>Sorry, the article you are looking for does not exist.</p><a href='index.html' class='btn btn-primary'>Go Home</a>";
      relatedContainer.innerHTML = "";
    }
  }
});
