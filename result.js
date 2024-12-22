    document.addEventListener('DOMContentLoaded', () => {
      const resultsContainer = document.getElementById('results-container');
      const resultsHeading = document.getElementById('results-heading');

      // Retrieve search results and query from localStorage
      const results = JSON.parse(localStorage.getItem('searchResults'));
      const query = localStorage.getItem('searchQuery');

      // Update heading
      if (results && results.length > 0) {
        resultsHeading.textContent = `Search results for "${query}" (${results.length} result${results.length > 1 ? 's' : ''})`;
      } else {
        resultsHeading.textContent = `No results found for "${query}"`;
      }

      // Render results
      if (results && results.length > 0) {
        results.forEach(result => {
          const resultElement = document.createElement('div');
          resultElement.className = 'result-item';

          // Use a placeholder if the feature image is not available
          const imageUrl = result["Feature image"] || 'https://via.placeholder.com/100';

          resultElement.innerHTML = `
            <img src="${imageUrl}" alt="${result.Title}" />
            <div>
              <h3><a href="https://gavel.io/resources/${result.Slug}" target="_blank">${result.Title}</a></h3>
              <p>${result.Excerpt || ''}</p>
            </div>
          `;

          resultsContainer.appendChild(resultElement);
        });
      }
    });
