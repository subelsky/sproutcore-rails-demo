/* Start ----------------------------------------------------- main.js*/

// ==========================================================================
// Cookbook
// ==========================================================================

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
function main() {

  // Step 1: Load Your Model Data
  // The default code here will load the fixtures you have defined.
  // Comment out the preload line and add something to refresh from the server
  // when you are ready to pull data from your server.

  if (Cookbook.localMode) {
    Cookbook.server.preload(Cookbook.FIXTURES) ;
  } else {
    Cookbook.server.listFor({ recordType: Cookbook.Recipe });
  }

  // TODO: refresh() any collections you have created to get their records.
  // ex: Cookbook.contacts.refresh() ;

  // Step 2: Instantiate Your Views
  // The default code just activates all the views you have on the page. If
  // your app gets any level of complexity, you should just get the views you
  // need to show the app in the first place, to speed things up.
  SC.page.awake() ;

  // Step 3. Set the content property on your primary controller.
  // This will make your app come alive!

  // var folders = OI.Folder.collection({ orderBy: ['order'] });
  // OI.foldersController.set('content',folders);
  // folders.refresh();

  var recipes = Cookbook.Recipe.collection();
  Cookbook.recipeMasterController.set('content',recipes);
  recipes.refresh();
  
} ;


/* End ------------------------------------------------------- main.js*/

