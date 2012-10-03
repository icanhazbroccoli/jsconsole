var CommandFactory = ( function() {
  return {
    create: function() {
      return new LazyCommand();
    }
  }
} )();