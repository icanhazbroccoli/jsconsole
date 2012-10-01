var JSConsole = new Class( {

  initialize: function( options ) {
    this.commandPool = {};
    this.history = [];
    this.sl = "\0";
    this.prompt = options.prompt;
    this.ui = options.ui;
    var self = this;
    this.ui.addEvent( "keydown", function( e ) {
      self.keyPressed.call( self, e )
    });
    this.pprompt( true );
    this.bindSlideDown();
  },

  registerCommand: function( command ) {
    this.commandPool[ command.name ] = command;
    command.setTerminal( this );
  },

  pprompt: function( nofocus ) {
    if ( nofocus == undefined ) nofocus = false;
    if ( this.ui.value.search( this.sl ) != -1 ) {
      this.ui.value += "\n";
    }
    this.ui.value += this.prompt + this.sl;
    console.log( this.ui.value.length );
    if ( !nofocus ) {
      this.setCaretPosition( this.ui.value.length );
      this.ui.scrollTop = this.ui.scrollHeight;
    }
  },

  getInput: function() {
    return this.ui.value.substring( this.searchLast( this.ui.value, this.sl ) + 1, this.ui.value.length );
  },

  searchLast: function( str, reg ) {
    res = -1;
    chunk = 0;
    while ( ( res = str.search( reg ) ) != -1 ) {
      res += 1
      chunk += res;
      str = str.substring( res, str.length );
    }
    return res + chunk;
  },

  keyPressed: function( e ) {
    var input = this.getInput();
    var self = this;
    if ( this.ui.selectionStart <= this.searchLast( this.ui.value, "\0" ) ) {
      e.stop();
      return;
    }
    switch( e.code ) {
      case 13:
        e.stop();
        this.proceed( input, function() { self.pprompt.call( self );
 } );
        break;
      case 8:
        if ( input == "" )
          e.stop();
        break;
      case 75:
        // ⌘ + K || Ctrl + K
        if ( e.meta == true || e.control == true ) {
          e.stop();
          this.ui.value = "";
          this.pprompt();
        }
        break;
      case 67:
        // Ctrl + C
        if ( e.control == true ) {
          this.cout( "^C" );
          this.resetHistoryIndex();
          e.stop();
          this.pprompt();
        }
        break;
      case 37:
      //case 38:
        if ( e.meta == true || e.control == true ) {
          e.stop();
          break;
        }
        break;
      case 38:
        e.stop();
        this.historySearch( -1 );
        break;
      case 40:
        e.stop();
        this.historySearch( 1 );
        break;
      case 46:
        e.stop();
        break;
      case 9:
        this.hint( input );
        e.stop();
        break;
      default:
        break;
    }
  },

  proceed: function( cmd, cb ) {
    if ( cmd == "" ) {
      cb();
      return;
    }
    this.history.push( cmd );
    this.resetHistoryIndex();
    var argv = cmd.split( " " );
    var command = argv[ 0 ];
    var argc = argv.slice( 1 );
    if ( this.commandPool[ command ] == null ) {
      var absolutely = [ "И поныне так", "Безоговорочно", "Вне всяких сомнений", "Совсем", "Вовсе", "Если вы понимаете, о чем я", "Опять", "Кто бы сомневался", "Удивил, ага" ];
      this.cout( "\nКоманда <" + command + "> не найдена. " + absolutely[ Math.floor( Math.random() * absolutely.length ) ] + "." );
      cb();
      return;
    }
    this.commandPool[ command ].exec( argc, cb );
  },

  hint: function( chunk ) {
    if ( chunk == "" ) return;
    var keys = Object.keys( this.commandPool );
    var to_prompt = [];
    Object.each( keys, function( obj ) {
      if ( obj.search( chunk ) === 0 ) to_prompt.push( obj );
    } );
    if ( to_prompt.length == 0 ) return;
    if ( to_prompt.length == 1 ) {
      this.cout( to_prompt[ 0 ].substring( chunk.length, to_prompt[ 0 ].length ) );
      return;
    }
    this.cout( "\n" + to_prompt.join( "\t" ) );
    this.pprompt();
    this.cout( chunk );
  },

  historySearch: function( step ) {
    if ( this.history_index === undefined ) this.resetHistoryIndex();
    if ( this.history_index === null ) {
      this.history_index = this.history.length;
      this.last_input = this.getInput();
    }
    var new_index = this.history_index + step;
    if ( new_index >= 0 && new_index < this.history.length ) {
      this.history_index = new_index;
      this.replaceInputWith( this.history[ this.history_index ] );
    } else if ( new_index == this.history.length ) {
      this.replaceInputWith( this.last_input || "" );
    }
  },

  resetHistoryIndex: function() {
    this.history_index = null;
  },

  replaceInputWith: function( cmd ) {
    var last_pos = this.searchLast( this.ui.value, this.sl ) + 1;
    this.ui.value = this.ui.value.substring( 0, last_pos ) + cmd;
  },

  cout: function( v ) {
    this.ui.value += v;
  },

  // http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
  // thx!
  setCaretPosition: function ( caretPos ) {
    var elem = this.ui;

    if ( elem.createTextRange ) {
      var range = elem.createTextRange();
      range.move('character', caretPos);
      range.select();
    } else {
      if ( elem.selectionStart ) {
          elem.focus();
          elem.setSelectionRange(caretPos, caretPos);
      } else
          elem.focus();
    }
  },

  bindSlideDown: function() {
    var _parent = this.ui.getParent();
    _parent.getElements( ".swiper" ).addEvent( "click", function( e ) {
      e.stop();
      _parent.toggleClass( "collapsed" );
    } );
  }
  
} );



var Command = new Class( {
  
  initialize: function( options ) {
    this.options = options;
  },

  exec: function( args, cb ) {
    cb.call( this.terminal );
  },

  setTerminal: function( terminal ) {
    this.terminal = terminal;
  },

  cout: function( arg ) {
    this.terminal.cout( arg );
  },

  argGiven: function( argc ) {
    if ( arguments.length > 1 ) {
      for ( var i = 1; i <= arguments.length; ++i ) {
        console.log( arguments[ i ] );
        if ( argc.indexOf( arguments[ i ] ) != -1 ) {
          return true;
        };
      }
    }
    return false;
  },
  help: function() {
    this.cout( "\nПо какой-то причине мы поленились написать руководство к этой команде. Даже не знаю по какой )))" );
  }
} );

var HelpCommand = new Class( {
  Extends: Command,
  name: "help",
  exec: function( argc, cb ) {
    this.cout( "\nНаш игрушечный терминал" );
    this.cout( "\n\nДоступные команды:" );
    this.cout( "\n" + Object.keys( this.terminal.commandPool ).join( "\t" ) );
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

var ContactsCommand = new Class( {
  Extends: Command,
  name: "contacts",
  exec: function( argc, cb ) {
    if ( argc.length >= 1 ) {
      if ( this.argGiven( argc, "-a", "--address" ) ) {
        this.cout( "\nУ нас нет физических офисов и конкретных адресов. Мы работаем везде где есть электричество и интернет." );
      }
      if ( this.argGiven( argc, "-p", "--phone" ) ) {
        this.cout( "\nНаш номер телефона: " + this.options.phone );
      }
      if ( this.argGiven( argc, "-m", "--email" ) ) {
        this.cout( "\nНаш адрес почты: " + this.options.email );
      }
      if ( this.argGiven( argc, "-s", "--skype" ) ) {
        this.cout( "\nSkype: " + this.options.skype );
      }
    } else {
      this.cout( "\n┌────────────────────────────────────────┐" );
      this.cout( "\n│ o_o █▔◣ ███ █   █ █▔◣ ███ █▔◣  █▔◣ █ █ │" );
      this.cout( "\n│ o^o █ █ █◼   █ █  █ █ █◼  █▃◤  █▃◤ █ █ │" );
      this.cout( "\n│     █▃◤ ███   █   █▃◤ ███ █  ● █ ◣ ◥▃◤ │" );
      this.cout( "\n│                                        │" );
      this.cout( "\n│ ✆ Телефон: " + this.options.phone + "            │" );
      this.cout( "\n│                                        │" );
      this.cout( "\n│ ✉ Почта: " + this.options.email + "                  │" );
      this.cout( "\n│                                        │" );
      this.cout( "\n│ (S) skype: " + this.options.skype + "                      │" );
      this.cout( "\n│                                        │" );
      this.cout( "\n│     ☔⚔✂⚡☹ -> ✆⌘: ∬∂(∛x)/∂x -> ☼☺♥♫     │" );
      this.cout( "\n└────────────────────────────────────────┘" );
    }
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда contacts:" );
    this.cout( "\nНаша контактная информация" );
    this.cout( "\n\tдоступные опции:" );
    this.cout( "\n\t--address, -a: выводит наш адрес" );
    this.cout( "\n\t--phone, -p: выводит наш телефон" );
    this.cout( "\n\t--email, -m: выводит наш адрес почты" );
    this.cout( "\n\t--skype, -s: выодит наш skype" );
  }
} );

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

var WhyCommand = new Class( {
  Extends: Command,
  name: "why",
  exec: function( argc, cb ) {
    this.cout( "\nЗачем? Хотелось селать что-то приятное ☺" );
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда help:" );
    this.cout( "\nРасскажет зачем мы нужны" );
  }
} );

var WhoCommand = new Class( {
  Extends: Command,
  name: "who",
  exec: function( argc, cb ) {
    this.cout( "\nНемного о том, кто мы такие:" );
    this.cout( "\nМы — команда инди-разработчиков с очень большим опытом в области беспрецедентных интерактивных систем, больших нагрузок и сложных интеграций." );
    this.cout( "\nВ настоящее время мы работаем инженерами / архитекторами / консультантами в крупнейших компаниях, и чувствуем в себе силу решать гораздо больше задач, чем у нас уже есть." );
    this.cout( "\nМы готовы брать на себя всю разработку по проекту, проводить консультации, вести аудит и контроль имполнения, составлять отчеты, помогать управлять людьми, обучать людей, давать советы по построению структуры команды." );
    this.cout( "\nМы верим в ваши идеи!" );
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nКоманда who:" );
    this.cout( "\nРасскажет немного о нас и наших принципах" );
  }
} );

var AsdasdCommand = new Class( {
  Extends: Command,
  name: "asdasd",
  exec: function( argc, cb ) {
    this.cout( "\nНу, кстати, почему бы и нет!" );
    this.parent( argc, cb );
  }
} );

var ExclamationCommand = new Class( {
  Extends: Command,
  name: "!",
  exec: function( argc, cb ) {
    this.cout( "\nСерьезно?" );
    this.parent( argc, cb );
  }
} )

var QuestionCommand = new Class( {
  Extends: Command,
  name: "?",
  exec: function( argc, cb ) {
    this.cout( "\n42" );
    this.parent( argc, cb );
  }
} )

var HelloCommand = new Class( {
  Extends: HelpCommand,
  name: "hello"
} )
