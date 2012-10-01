var LangsCommand = new Class( {
  Extends: Command,
  name: "langs",
  exec: function( argc, cb ) {
    this.cout( "\n" + "Мы ведем разработку на следущих языках программирования:" );
    this.cout( "\n" + this.options.langs.sort().join( "\t" ) );
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда langs:" );
    this.cout( "\nВыводит список используемых нами языков программирования" )
  }
} );