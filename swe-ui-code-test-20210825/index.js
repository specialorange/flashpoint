import Autocomplete from './Autocomplete';
import states from './states';
import './main.css';


// US States
const data = states.map(state => ({
  text: state.name,
  value: state.abbreviation
}));

new Autocomplete(
  document.getElementById('state'),
  { staticData: data }
);

// Github Users
new Autocomplete(
  document.getElementById('gh-user'),
  {
  }
);
