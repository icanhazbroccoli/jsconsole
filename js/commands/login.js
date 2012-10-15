var LoginCommand = new Class({
  
  Extends: Command,
  
  name: "login",
  
  initialize: function( options ) {
    this.parent( options );
    this.login = null;
    this.pass = null;
    this.cb = null;
    this.show_type = true;
    this.hidden_typed = "";
    this.active = false;
    var self = this;
    document.addEvent( "keydown", function( e ) {
      self.onKeyPressed.call( self, e );
    } );
  },

  onKeyPressed: function( e ) {
    if ( !this.active ) {
      return;
    }
    if ( e.code == 13 ) {
      if ( this.login === null ) {
        this.login = this.terminal.getInput();
        this.promptPassword();
      } else {
        this.password = this.hidden_typed;
        //this.releaseInput();
        this.terminal.releaseInput();
        this.active = false;
        if ( typeof( this.cb ) == "function" ) {
          this.cb();
        }
      }
    } else if ( this.show_type === false ) {
      // this.hidden_typed += e.
    }
  },
  
  exec: function( argc, cb ) {
    var self = this;
    this.cb = function() {
      self.parent( argc, cb );
    };
    this.login = null;
    this.pass = null;
    this.promptLogin();
    this.terminal.captureInput();
    this.active = true; 
  },
  
  setShowType: function( v ) {
    this.show_type = v;
  },
  
  promptLogin: function() {
    this.cout( "\nLogin: " );
    this.setShowType( true );
  },
  
  promptPassword: function() {
    this.cout( "\nPassword: " );
    this.setShowType( false );
    hidden_typed = "";
  },
  
//  releaseInput: function() {
//    //this.terminal.ui.removeEvent( "keydown", this.onKeyPressed );
//    
//    
//    return this;
//  },
  
  help: function() {
    this.cout( "\nLogin command" );
    this.cout( "\nNot implemented yet... sorry." );
  }
});
