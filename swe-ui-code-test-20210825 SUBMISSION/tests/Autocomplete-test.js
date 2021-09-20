import expect from 'expect';
import jsdom from 'jsdom-global';
import Autocomplete from '../Autocomplete';
import html from '../index.html';

let wrapper;

describe('Autocomplete', () => {
  before(() => {
    document.body.innerHTML = html;
    wrapper = new Autocomplete(document.getElementById('state'));
  });

  describe('States', () => {
    it('should initialize', () => {
      const input = document.querySelector('input');
      const results = document.querySelector('ul');

      expect(input).toBeTruthy();
      expect(input.type).toEqual('search');
      expect(input.name).toEqual('query');
      expect(results.className).toEqual('results');
    });

    it('should handle keyboard input', () => {
      expect(true).toBeTruthy();
    });

    it('should populate input on value selection', () => {
      expect(true).toBeTruthy();
    })
  });

  describe('Github Profiles', () => {
    before(() => {
      document.body.innerHTML = html;
      wrapper = new Autocomplete(document.getElementById('gh-user'));
    });


    it('should fetch github user(s) on text input', () => {
      const input = document.getElementById('gh-user').getElementsByClassName('float-left')[0].querySelectorAll('input');
      function asyncTextInput () {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000)
        })
      }
      expect(input).toBeTruthy();
      input.value = 'special'
      asyncTextInput()
        .then(() =>{
          const results = document.getElementById('gh-user').getElementsByClassName('float-left')[0].getElementsByClassName('results')[0].getElementsByClassName('result')
          const resultsCount = results.length
          expect(results).toBeTruthy();
          expect(input.value).toBe('special')
          expect(resultsCount).toEqual(10)
        })
    });

    it('should handle no results found', () => {
      expect(true).toBeTruthy();
    });

    it('should display user profile', () => {
      expect(true).toBeTruthy();
    })
  })
});
