// categories.js
export default {
  namespaced: true,
  state: {
    categories: [
      {
        id: 'discover-classics',
        name: 'Discover Classics',
        image: 'categories/discover-classics/classics.jpg',
        description: 'Timeless Nike classics that never go out of style'
      },
      {
        id: 'running',
        name: 'Running',
        image: 'categories/running/running.jpg',
        description: 'High-performance running shoes for every runner'
      },
      {
        id: 'football',
        name: 'Football',
        image: 'categories/football/football.jpg',
        description: 'Professional football boots for the beautiful game'
      },
      {
        id: 'basketball',
        name: 'Basketball',
        image: 'categories/basketball/basketball.jpg',
        description: 'Basketball shoes for ultimate court performance'
      }
    ],
    sections: [
      {
        id: 'classics',
        name: 'Discover Classics',
        categories: ['discover-classics']
      },
      {
        id: 'sports',
        name: 'Shop by Sport',
        categories: ['running', 'football', 'basketball']
      }
    ]
  },
  getters: {
    allCategories: state => state.categories,
    allSections: state => state.sections,
    getCategoryById: state => id => state.categories.find(cat => cat.id === id),
    getSectionById: state => id => state.sections.find(section => section.id === id),
    getSportCategories: state => state.categories.filter(cat => ['running', 'football', 'basketball'].includes(cat.id))
  }
};
