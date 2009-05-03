// ==========================================================================
// Cookbook
// ==========================================================================

require('cookbook_server');

localMode = window.location.hash === '#development';

Cookbook = SC.Object.create({
  
  localMode: localMode,

  server: SC.Server.create({ prefix: ['Cookbook'] }), // we only use this so we can get preload

  // When you are in development mode, this array will be populated with
  // any fixtures you create for testing and loaded automatically in your
  // main method.  When in production, this will be an empty array.
  FIXTURES: []

}) ;
