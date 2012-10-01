var FrameworksCommand = new Class( {
  Extends: Command,
  name: "frameworks",
  exec: function( argc, cb ) {
    this.cout( "\n" + "Мы ведем разработку с использованием фреймворков:" );
    this.cout( "\n" + this.options.frameworks.sort().join( "\t" ) );
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда frameworks:" );
    this.cout( "\nВыведет список используемых нами фреймворков" );
  }
} );