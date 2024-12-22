// Fetch the JSON file
    async function fetchData() {
      const response = await fetch('https://vatjufavnkmhakxjtaul.supabase.co/storage/v1/object/public/Desk%20of%20Mj/Gavel_Site_Resources.json');
      if (!response.ok) {
        throw new Error('Failed to fetch JSON file');
      }
      return response.json();
    }

    // Real-time search function
    function performSearch(data, query) {
      query = query.toLowerCase();
      return data.filter(item => {
        return item.Title.toLowerCase().includes(query) ||
               item.Slug.toLowerCase().includes(query) ||
               (item.Category && item.Category.toLowerCase().includes(query));
      });
    }

    // Update search results
    function updateResults(results, query) {
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.innerHTML = '';

      if (query.trim() === '') {
        resultsContainer.classList.remove('expanded');
        resultsContainer.innerHTML = '<p>Start typing to see results...</p>';
        return;
      }

      resultsContainer.classList.add('expanded');

      if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
      }

      const maxResultsToShow = 3;
      const resultsToShow = results.slice(0, maxResultsToShow);

      resultsToShow.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        const imageUrl = result["Feature image"] || 'https://via.placeholder.com/50';

        resultElement.innerHTML = `
          <img src="${imageUrl}" alt="${result.Title}" />
          <div>
            <h3><a href="https://gavel.io/resources/${result.Slug}" target="_blank">${result.Title}</a></h3>
            <p>${result.Slug}</p>
            <p><strong>Category:</strong> ${result.Category || 'N/A'}</p>
          </div>
        `;
        resultsContainer.appendChild(resultElement);
      });

      if (results.length > maxResultsToShow) {
        const viewAllButton = document.createElement('button');
        viewAllButton.textContent = `View all results for "${query}"`;
        viewAllButton.addEventListener('click', () => {
          saveResultsAndRedirect(results, query);
        });
        resultsContainer.appendChild(viewAllButton);
      }
    }

    // Save results to local storage and redirect
    function saveResultsAndRedirect(results, query) {
      localStorage.setItem('searchResults', JSON.stringify(results));
      localStorage.setItem('searchQuery', query);
      window.location.href = '/results';
    }

    // Main function to initialize the search
    async function initSearch() {
      try {
        const data = await fetchData();
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        const resultsContainer = document.getElementById('search-results');

        searchInput.addEventListener('input', () => {
          const query = searchInput.value.trim();
          if (query === '') {
            clearSearchBtn.style.display = 'none';
            resultsContainer.classList.remove('expanded');
            resultsContainer.innerHTML = '<p>Start typing to see results...</p>';
            return;
          }

          clearSearchBtn.style.display = 'block';
          const results = performSearch(data, query);
          updateResults(results, query);
        });

        clearSearchBtn.addEventListener('click', () => {
          searchInput.value = '';
          clearSearchBtn.style.display = 'none';
          resultsContainer.classList.remove('expanded');
          resultsContainer.innerHTML = '<p>Start typing to see results...</p>';
        });

        searchInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            const results = performSearch(data, query);
            saveResultsAndRedirect(results, query);
          } else if (event.key === 'Escape') {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            resultsContainer.classList.remove('expanded');
            resultsContainer.innerHTML = '<p>Start typing to see results...</p>';
          }
        });
      } catch (error) {
        console.error('Error initializing search:', error);
        document.getElementById('search-results').innerHTML = '<p>Failed to load data. Please try again later.</p>';
      }
    }

    document.addEventListener('DOMContentLoaded', initSearch);
