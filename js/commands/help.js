var HelpCommand = new Class( {
  Extends: Command,
  name: "help",
  exec: function( argc, cb ) {
    this.cout( "\nНаш игрушечный терминал" );
    this.cout( "\n\nДоступные команды:" );
    this.cout( "\n" + Object.keys( this.terminal.commandPool ).filter( function( i ) {
      return ( i != null );
    } ).join( "\t" ) );
    this.cout( "\n\nВ терминале работают шорткеи:" );
    this.cout( "\n* ⌘+K, Ctrl+K — очистит буфер вывода" );
    this.cout( "\n* Ctrl + C — прервет выполнение текушей команды" );
    this.cout( "\n\nДля команд работает автодополнение через нажатие Tab" );
    this.cout( "\nПо каждой команде можно получить справку через команду man" );
    this.cout( "\n\nПриятного использования! )))" );
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда help:" );
    this.cout( "\nКраткая помощь по этому терминалу" );
  }
} );