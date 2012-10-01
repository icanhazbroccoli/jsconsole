var ManCommand = new Class( {
  Extends: Command,
  name: "man",
  exec: function( argc, cb ) {
    if ( argc.length < 1 ) {
      this.help();
    } else {
      var cmd = this.terminal.commandPool[ argc[ 0 ] ];
      if ( cmd !== undefined ) {
        cmd.help();
      } else {
        this.cout( "\n" + argc[ 0 ] + ": команда не найдена. Для списка доступных команд можно набрать help↲" );
      }
    }
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда man:" );
    this.cout( "\nПолучение информации об использовании команд" );
    this.cout( "\nИспользование: man <команда>" );
  }
} );