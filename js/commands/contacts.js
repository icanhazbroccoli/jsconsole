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