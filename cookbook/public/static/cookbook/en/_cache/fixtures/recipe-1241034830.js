/* Start ----------------------------------------------------- fixtures/recipe.js*/

// ==========================================================================
// Cookbook.Recipe Fixtures
// ==========================================================================

require('core') ;
console.info("load fix")
Cookbook.FIXTURES = Cookbook.FIXTURES.concat([

  { guid: 1,
    name: "Peanut Butter and Jelly"
    type: 'Recipe',
    prep_time: 3
    cook_time: 0
    },

  { guid: 2,
    name: "Vegetable Korma"
    type: 'Recipe',
    prep_time: 45
    cook_time: 35
    }
    
  // TODO: Add your data fixtures here.
  // All fixture records must have a unique guid and a type matching the
  // name of your contact.  See the example below.

  // { guid: 1,
  //   type: 'Contact',
  //   firstName: "Michael",
  //   lastName: "Scott"
  // },
  //
  // { guid: 2,
  //   type: 'Contact',
  //   firstName: "Dwight",
  //   lastName: "Schrute"
  // },
  //
  // { guid: 3,
  //   type: 'Contact',
  //   firstName: "Jim",
  //   lastName: "Halpert"
  // },
  //
  // { guid: 4,
  //   type: 'Contact',
  //   firstName: "Pam",
  //   lastName: "Beesly"
  // },
  //
  // { guid: 5,
  //   type: 'Contact',
  //   firstName: "Ryan",
  //   lastName: "Howard"
  // }

]);


/* End ------------------------------------------------------- fixtures/recipe.js*/

