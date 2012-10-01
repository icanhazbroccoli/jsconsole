var LSCommand = new Class( {
  Extends: Command,
  name: "ls",
  exec: function( argc, cb ) {
    this.cout( "\n" + [ "index.html", "css", "fonts", "images", "javascripts", ".htaccess", "xxx.jpg", "diplom_final", "diplom_very_final", "diplom_pechat", "diplom_final_pechat", "diplom_ok", "diplom_ok123" ].sort().join( "\t" ) );
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда ls:" );
    this.cout( "\nЛистинг файлов текущей директории" );
  }
} );