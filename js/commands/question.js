var QuestionCommand = new Class( {
  Extends: Command,
  name: "?",
  exec: function( argc, cb ) {
    this.cout( "\n42" );
    this.parent( argc, cb );
  }
} );