class Autocomplete {
  constructor(rootEl, options = {}) {
    Object.assign(this, { 
      rootEl,
      numOfResults: options.numOfResults || 10,
      // data: [],
      data: options.data,
      url: options.url,
      staticData: options.staticData || false,
      onSelect: options.onSelect || this.onSelect,
      options }
    );
    this.init();
  }

  init() {
    this.leftSide = document.createElement('div');
    Object.assign(this.leftSide, { className: 'flex-child float-left' });
    this.rootEl.appendChild(this.leftSide)
    //Build Error
    this.rightSide = document.createElement('div');
    Object.assign(this.rightSide, { className: 'errors flex-child float-right' });
    this.rootEl.appendChild(this.rightSide)

    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.leftSide.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.leftSide.appendChild(this.listEl);  

    // Build selected result
    this.resultEl = document.createElement('div');
    Object.assign(this.resultEl, { className: 'final-result' });
    this.leftSide.appendChild(this.resultEl);  
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
      selected: undefined,
      current: undefined,
    }, this);

    inputEl.addEventListener('input', event => {
      this.onQueryChange(event.target.value)
    })
    let keypresses = function(self){      
      switch(event.code) {
        case "ArrowUp":
          console.log('Up Arrow was pressed')
          break;
        case "ArrowDown":
          console.log('Down Arrow was pressed')
          break;
        case "Enter":
          console.log('Enter was pressed')
          break;
      }
    }
    inputEl.addEventListener('keydown', (event) => keypresses(this))
    return inputEl;
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result, idx, arr) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.login,
      });

      // Pass the value to the onSelect callback
      let onclck = function(self) {
        let resultName = result.id ? result.id : result.text
        self.onSelect(resultName);
      }
      el.addEventListener('click', (event) => onclck(this) )

      fragment.appendChild(el);
    }, this);
    this.results = fragment
    return fragment;
  }

  createErrorEl(error) {
    const el = document.createElement('div');
    let d = new Date()
    Object.assign(el, {
      className: 'error',
      textContent: d.toLocaleTimeString() + `.${d.getMilliseconds()}` + ': ' + error,
    });
    setTimeout(function() { 
      el.remove(); 
    }, 5000);
    return el;
  }

  updateError(error) {
    this.rightSide.appendChild(this.createErrorEl(error));
  }

  onSelect(finalResult) {
    this.resultEl.innerHTML = finalResult
  }

  handleErrors(response) {
    let errorMessage = 'Unknown Error While Searching: Error ID : 6472'
    if (!response.ok) {
      if (response.status == 403) { 
        let query = response.url.match(/q=(.*)/)
        errorMessage = response.status + ': ' + response.statusText + " q= " + (query != null && query[1])
      }
      if (response.status == 404) { errorMessage = response.status + ': ' + response.statusText }
      this.updateError(errorMessage);
      throw Error(response.statusText);
    }
    return response;
  }

  onQueryChange(query) {
    if (!query) return [];
    if (this.staticData) {
      this.searchStaticData(query)
    } else {
      this.searchAPI(query)
    }
  }

  // async/await  "babel-polyfill": "^6.26.0",
  searchAPI(query) {
    fetch(new Request('https://api.github.com/search/users?q=' + query))
      .then(res => this.handleErrors(res))
      .then(res => { return res.json(); })
      .then(data => {
        this.data = data; 
        this.updateDropdown(this.data.items.slice(0, this.numOfResults));
      })
      .catch(err => {
        console.log('Error: ', err)
      })
  }

  searchStaticData(query) {
    // Filter for matching strings
    let results = this.staticData.filter((item) => {
      // Adding/Updating attribute for extensibility
      item.login = item.text
      return item.text.toLowerCase().includes(query.toLowerCase());
    });
    results = results.slice(0, this.numOfResults);
    this.updateDropdown(results);
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }
};

export default Autocomplete;