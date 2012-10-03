var LazyCommand = new Class( {
  Extends: Command,
  name: null,
  title: null,
  body: null,
  help_brief: null,
  
  named: function( name ) {
    this.name = name;
    return this;
  },
  
  titled: function( title ) {
    this.title = title;
    return this;
  },
  
  withOptions: function( k ) {
    if ( arguments.length > 1 ) {
      this.options[ k ] = arguments.length[ 1 ];
    } else if ( k instanceof Object ) {
      this.options = Object.merge( this.options, k );
    }
    return this;
  },
  
  withHelp: function( help_brief ) {
    this.help_brief = help_brief;
    return this;
  },
  
  withBody: function( body ) {
    this.body = body;
    return this;
  },
  
  help: function() {
    if ( this.help_brief === null ) {
      this.parent();
    } else {
      this.cout( "\n" + this.help_brief );
    }
  },
  
  exec: function( args, cb ) {
    if ( this.title !== null ) {
      this.cout( "\n" + this.title );
    }
    if ( this.body !== null ) {
      this.cout( "\n" + this.body );
    }
    this.parent( args, cb );
  }
  
} );